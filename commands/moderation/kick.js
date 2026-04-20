const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { logAction } = require('../../utils/logger');
const Case = require('../../models/Case');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a expulsar').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón del kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getMember('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';

    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('No puedes expulsarte a ti mismo.')], ephemeral: true });
    if (!target.kickable) return interaction.reply({ embeds: [errorEmbed('No puedo expulsar a ese usuario.')], ephemeral: true });
    if (target.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed('No puedes expulsar a alguien con igual o mayor rango.')], ephemeral: true });

    await target.kick(`${reason} | Por: ${interaction.user.tag}`);

    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'kick', userId: target.id, moderatorId: interaction.user.id, reason });

    await logAction(client, 'kick', { Usuario: target.user.tag, Moderador: interaction.user.tag, Razón: reason, Caso: `#${caseId}` });
    interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** ha sido expulsado. | Caso #${caseId}\n**Razón:** ${reason}`)] });
  },
};
