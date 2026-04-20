const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isOwner } = require('../../utils/permissions');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servers')
    .setDescription('[OWNER] Lista de servidores donde está el bot'),
  cooldown: 10,
  async execute(interaction, client) {
    if (!isOwner(interaction.user.id))
      return interaction.reply({ content: '❌ Solo el dueño puede usar este comando.', ephemeral: true });

    const guilds = client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .first(20);

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`🌐 Servidores (${client.guilds.cache.size} total)`)
      .setDescription(guilds.map(g => `**${g.name}** — ${g.memberCount} miembros | \`${g.id}\``).join('\n'));

    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
