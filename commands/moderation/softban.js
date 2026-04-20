// softban.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const Case = require('../../models/Case');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('Banea y desbanea para limpiar mensajes del usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón';

    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (!target.bannable) return interaction.reply({ embeds: [errorEmbed('No puedo banear a ese usuario.')], ephemeral: true });

    await target.ban({ deleteMessageDays: 7, reason });
    await interaction.guild.bans.remove(target.id, 'Softban - limpieza de mensajes');

    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'softban', userId: target.id, moderatorId: interaction.user.id, reason });

    interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** ha sido softbaneado (mensajes eliminados). | Caso #${caseId}`)] });
  },
};
