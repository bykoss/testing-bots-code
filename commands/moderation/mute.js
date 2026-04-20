const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { logAction } = require('../../utils/logger');
const Case = require('../../models/Case');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia a un usuario con timeout')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a silenciar').setRequired(true))
    .addStringOption(o => o.setName('duracion').setDescription('Duración (ej: 10m, 1h, 1d)').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón del mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getMember('usuario');
    const durStr = interaction.options.getString('duracion');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';
    const duration = ms(durStr);

    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (!duration || duration > ms('28d')) return interaction.reply({ embeds: [errorEmbed('Duración inválida. Máximo 28 días.')], ephemeral: true });
    if (!target.moderatable) return interaction.reply({ embeds: [errorEmbed('No puedo silenciar a ese usuario.')], ephemeral: true });

    await target.timeout(duration, `${reason} | Por: ${interaction.user.tag}`);

    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'mute', userId: target.id, moderatorId: interaction.user.id, reason, duration });

    await logAction(client, 'mute', { Usuario: target.user.tag, Moderador: interaction.user.tag, Duración: durStr, Razón: reason });
    interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** ha sido silenciado por **${durStr}**. | Caso #${caseId}\n**Razón:** ${reason}`)] });
  },
};
