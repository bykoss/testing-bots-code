const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const Case = require('../../models/Case');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cases')
    .setDescription('Ver historial de moderación de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 5,
  async execute(interaction) {
    const target = interaction.options.getUser('usuario');
    const cases = await Case.find({ guildId: interaction.guild.id, userId: target.id }).sort({ caseId: 1 }).limit(25);

    if (!cases.length) return interaction.reply({ embeds: [errorEmbed(`No hay casos para **${target.tag}**.`)], ephemeral: true });

    const icons = { ban: '🔨', unban: '✅', kick: '👢', mute: '🔇', unmute: '🔊', warn: '⚠️', softban: '🧹', timeout: '⏱️' };

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`📋 Casos de ${target.tag}`)
      .setThumbnail(target.displayAvatarURL())
      .setDescription(cases.map(c =>
        `${icons[c.type] || '📌'} **#${c.caseId}** | \`${c.type.toUpperCase()}\`\n> **Razón:** ${c.reason}\n> **Por:** <@${c.moderatorId}> | <t:${Math.floor(new Date(c.createdAt).getTime() / 1000)}:R>`
      ).join('\n\n'))
      .setFooter({ text: `Total: ${cases.length} caso(s)` });

    interaction.reply({ embeds: [embed] });
  },
};
