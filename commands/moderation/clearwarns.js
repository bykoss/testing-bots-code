const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('Limpia las advertencias de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });

    await User.findOneAndUpdate({ userId: target.id, guildId: interaction.guild.id }, { $set: { warns: [] } });
    interaction.reply({ embeds: [successEmbed(`Las advertencias de **${target.user.tag}** han sido eliminadas.`)] });
  },
};
