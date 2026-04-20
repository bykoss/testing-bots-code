const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Configura el modo lento del canal')
    .addIntegerOption(o => o.setName('segundos').setDescription('Segundos de slowmode (0 para desactivar)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 3,
  async execute(interaction) {
    const seconds = interaction.options.getInteger('segundos');
    await interaction.channel.setRateLimitPerUser(seconds);
    if (seconds === 0) {
      interaction.reply({ embeds: [successEmbed('Modo lento **desactivado** en este canal.')] });
    } else {
      interaction.reply({ embeds: [successEmbed(`Modo lento configurado a **${seconds}** segundo(s).`)] });
    }
  },
};
