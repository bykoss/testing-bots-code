const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Ver tu balance de monedas')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario')),
  cooldown: 5,
  async execute(interaction) {
    const member = interaction.options.getMember('usuario') || interaction.member;
    let userData = await User.findOne({ userId: member.id, guildId: interaction.guild.id });
    if (!userData) userData = await User.create({ userId: member.id, guildId: interaction.guild.id });
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`💰 Balance de ${member.user.tag}`)
      .addFields(
        { name: '👛 Efectivo', value: `${userData.balance} monedas`, inline: true },
        { name: '🏦 Banco', value: `${userData.bank} monedas`, inline: true },
        { name: '💎 Total', value: `${userData.balance + userData.bank} monedas`, inline: true },
      );
    interaction.reply({ embeds: [embed] });
  },
};
