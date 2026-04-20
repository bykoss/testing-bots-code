const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Ver perfil de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario')),
  cooldown: 5,
  async execute(interaction) {
    const member = interaction.options.getMember('usuario') || interaction.member;
    let userData = await User.findOne({ userId: member.id, guildId: interaction.guild.id });
    if (!userData) userData = await User.create({ userId: member.id, guildId: interaction.guild.id });

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || config.embedColor)
      .setTitle(`👤 Perfil de ${member.user.tag}`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '⭐ Reputación', value: `${userData.reputation}`, inline: true },
        { name: '⚠️ Advertencias', value: `${userData.warns.length}`, inline: true },
        { name: '💰 Balance', value: `${userData.balance}`, inline: true },
        { name: '🏦 Banco', value: `${userData.bank}`, inline: true },
        { name: '📊 Nivel', value: `${userData.level}`, inline: true },
        { name: '✨ XP', value: `${userData.xp}`, inline: true },
      );
    if (userData.bio) embed.setDescription(`*${userData.bio}*`);
    interaction.reply({ embeds: [embed] });
  },
};
