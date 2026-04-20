const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { logAction } = require('../../utils/logger');
const Case = require('../../models/Case');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un usuario del servidor')
    .addStringOption(o => o.setName('userid').setDescription('ID del usuario a desbanear').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón del desbaneo'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  cooldown: 3,
  async execute(interaction, client) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';

    const ban = await interaction.guild.bans.fetch(userId).catch(() => null);
    if (!ban) return interaction.reply({ embeds: [errorEmbed('Ese usuario no está baneado.')], ephemeral: true });

    await interaction.guild.bans.remove(userId, `${reason} | Por: ${interaction.user.tag}`);

    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'unban', userId, moderatorId: interaction.user.id, reason });

    await logAction(client, 'unban', { Usuario: ban.user.tag, Moderador: interaction.user.tag, Razón: reason });
    interaction.reply({ embeds: [successEmbed(`**${ban.user.tag}** ha sido desbaneado. | Caso #${caseId}`)] });
  },
};
