const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Reclama tu recompensa diaria'),
  cooldown: 3,
  async execute(interaction) {
    let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!userData) userData = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });

    const now = new Date();
    if (userData.lastDaily) {
      const diff = now - userData.lastDaily;
      if (diff < 86400000) {
        const remaining = 86400000 - diff;
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        return interaction.reply({ embeds: [errorEmbed(`Ya reclamaste tu daily. Vuelve en **${h}h ${m}m**.`)], ephemeral: true });
      }
    }

    const amount = Math.floor(Math.random() * 500) + 100;
    userData.balance += amount;
    userData.lastDaily = now;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor(config.successColor)
      .setTitle('💰 Daily Reclamado')
      .setDescription(`Recibiste **${amount} monedas**!\nBalance actual: **${userData.balance}**`)
      .setFooter({ text: 'Vuelve mañana para más' });
    interaction.reply({ embeds: [embed] });
  },
};
