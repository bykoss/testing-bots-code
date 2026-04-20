const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rep')
    .setDescription('Da reputación a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('No puedes darte reputación a ti mismo.')], ephemeral: true });
    if (target.user.bot) return interaction.reply({ embeds: [errorEmbed('No puedes dar rep a un bot.')], ephemeral: true });

    let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!userData) userData = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });

    const now = new Date();
    const lastRep = userData.lastRep;
    if (lastRep) {
      const diff = now - lastRep;
      const cooldown = 24 * 60 * 60 * 1000;
      if (diff < cooldown) {
        const remaining = Math.ceil((cooldown - diff) / 3600000);
        return interaction.reply({ embeds: [errorEmbed(`Puedes dar rep de nuevo en **${remaining}h**.`)], ephemeral: true });
      }
    }

    userData.lastRep = now;
    await userData.save();

    let targetData = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
    if (!targetData) targetData = await User.create({ userId: target.id, guildId: interaction.guild.id });
    targetData.reputation += 1;
    await targetData.save();

    interaction.reply({ embeds: [successEmbed(`Le diste +1 reputación a **${target.user.tag}**. (Total: ${targetData.reputation} ⭐)`)] });
  },
};
