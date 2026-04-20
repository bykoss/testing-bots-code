const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('Cambia el apodo de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o => o.setName('apodo').setDescription('Nuevo apodo (vacío para quitar)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    const nick = interaction.options.getString('apodo') || null;
    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    await target.setNickname(nick, `Por: ${interaction.user.tag}`);
    interaction.reply({ embeds: [successEmbed(nick ? `Apodo de **${target.user.tag}** cambiado a **${nick}**.` : `Apodo de **${target.user.tag}** eliminado.`)] });
  },
};
