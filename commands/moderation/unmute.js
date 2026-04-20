const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { logAction } = require('../../utils/logger');
const Case = require('../../models/Case');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Quita el silencio a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a dessilenciar').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getMember('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';

    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (!target.isCommunicationDisabled()) return interaction.reply({ embeds: [errorEmbed('Ese usuario no está silenciado.')], ephemeral: true });

    await target.timeout(null, `${reason} | Por: ${interaction.user.tag}`);

    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'unmute', userId: target.id, moderatorId: interaction.user.id, reason });

    await logAction(client, 'unmute', { Usuario: target.user.tag, Moderador: interaction.user.tag, Razón: reason });
    interaction.reply({ embeds: [successEmbed(`El silencio de **${target.user.tag}** ha sido removido. | Caso #${caseId}`)] });
  },
};
