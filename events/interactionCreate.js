const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    // Cooldown system
    const { cooldowns } = client;
    if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Map());
    const now = Date.now();
    const timestamps = cooldowns.get(command.data.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expiration = timestamps.get(interaction.user.id) + cooldownAmount;
      if (now < expiration) {
        const remaining = ((expiration - now) / 1000).toFixed(1);
        const embed = new EmbedBuilder()
          .setColor(config.warnColor)
          .setDescription(`⏳ Espera **${remaining}s** antes de usar \`/${command.data.name}\` de nuevo.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ Error en /${command.data.name}:`, error);
      const errEmbed = new EmbedBuilder()
        .setColor(config.errorColor)
        .setDescription('❌ Ocurrió un error al ejecutar este comando.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }
    }
  },
};
