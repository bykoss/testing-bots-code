const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-clone')
    .setDescription('Clona un canal con sus permisos')
    .addChannelOption(o => o.setName('canal').setDescription('Canal a clonar').setRequired(true))
    .addStringOption(o => o.setName('nombre').setDescription('Nombre del clon (opcional)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 10,
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const name = interaction.options.getString('nombre') || `${channel.name}-clon`;
    const clone = await channel.clone({ name }).catch(() => null);
    if (!clone) return interaction.reply({ embeds: [errorEmbed('No pude clonar el canal.')], ephemeral: true });
    interaction.reply({ embeds: [successEmbed(`Canal ${clone} clonado de **#${channel.name}**.`)] });
  },
};
