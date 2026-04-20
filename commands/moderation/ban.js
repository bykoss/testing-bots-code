const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { logAction } = require('../../utils/logger');
const Case = require('../../models/Case');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a banear').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón del ban'))
    .addIntegerOption(o => o.setName('dias').setDescription('Días de mensajes a eliminar (0-7)').setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getMember('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';
    const days = interaction.options.getInteger('dias') || 0;

    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('No puedes banearte a ti mismo.')], ephemeral: true });
    if (!target.bannable) return interaction.reply({ embeds: [errorEmbed('No puedo banear a ese usuario.')], ephemeral: true });
    if (target.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed('No puedes banear a alguien con igual o mayor rango.')], ephemeral: true });

    await target.ban({ deleteMessageDays: days, reason: `${reason} | Por: ${interaction.user.tag}` });

    // Save case
    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'ban', userId: target.id, moderatorId: interaction.user.id, reason });

    await logAction(client, 'ban', { Usuario: target.user?.tag || target.id, Moderador: interaction.user.tag, Razón: reason, Caso: `#${caseId}` });
    interaction.reply({ embeds: [successEmbed(`**${target.user?.tag}** ha sido baneado. | Caso #${caseId}\n**Razón:** ${reason}`)] });
  },
};
