const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Ver advertencias de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 5,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });

    const userData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
    if (!userData || userData.warns.length === 0)
      return interaction.reply({ embeds: [errorEmbed(`**${target.user.tag}** no tiene advertencias.`)], ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(config.warnColor)
      .setTitle(`⚠️ Advertencias de ${target.user.tag}`)
      .setThumbnail(target.user.displayAvatarURL())
      .setDescription(userData.warns.map((w, i) =>
        `**#${i + 1}** | Por: \`${w.moderator}\`\n> ${w.reason}\n> <t:${Math.floor(new Date(w.date).getTime() / 1000)}:R>`
      ).join('\n\n'))
      .setFooter({ text: `Total: ${userData.warns.length} advertencia(s)` });

    interaction.reply({ embeds: [embed] });
  },
};
