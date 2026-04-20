const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-delete')
    .setDescription('Elimina un canal')
    .addChannelOption(o => o.setName('canal').setDescription('Canal a eliminar').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 5,
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const reason = interaction.options.getString('razon') || 'Sin razón';
    const name = channel.name;
    await channel.delete(reason).catch(() => null);
    interaction.reply({ embeds: [successEmbed(`Canal **#${name}** eliminado.`)] });
  },
};
