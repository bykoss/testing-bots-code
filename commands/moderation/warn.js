const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const { logAction } = require('../../utils/logger');
const User = require('../../models/User');
const Case = require('../../models/Case');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Advierte a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario a advertir').setRequired(true))
    .addStringOption(o => o.setName('razon').setDescription('Razón de la advertencia').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 3,
  async execute(interaction, client) {
    const target = interaction.options.getMember('usuario');
    const reason = interaction.options.getString('razon');

    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (target.user.bot) return interaction.reply({ embeds: [errorEmbed('No puedes advertir a un bot.')], ephemeral: true });

    let userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
    if (!userData) userData = await User.create({ userId: target.id, guildId: interaction.guild.id });

    userData.warns.push({ reason, moderator: interaction.user.tag });
    await userData.save();

    const lastCase = await Case.findOne({ guildId: interaction.guild.id }).sort({ caseId: -1 });
    const caseId = (lastCase?.caseId || 0) + 1;
    await Case.create({ guildId: interaction.guild.id, caseId, type: 'warn', userId: target.id, moderatorId: interaction.user.id, reason });

    await logAction(client, 'warn', { Usuario: target.user.tag, Moderador: interaction.user.tag, Razón: reason, 'Total warns': userData.warns.length });
    interaction.reply({ embeds: [successEmbed(`**${target.user.tag}** ha recibido una advertencia. (${userData.warns.length} total)\n**Razón:** ${reason}`)] });
  },
};
