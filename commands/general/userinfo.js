const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Muestra información de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario (por defecto tú)')),
  cooldown: 5,
  async execute(interaction) {
    const member = interaction.options.getMember('usuario') || interaction.member;
    const user = member.user;
    const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id).sort((a, b) => b.position - a.position);

    const statusEmoji = { online: '🟢', idle: '🟡', dnd: '🔴', offline: '⚫' };
    const status = member.presence?.status || 'offline';

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || config.embedColor)
      .setTitle(`${statusEmoji[status]} ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '🆔 ID', value: user.id, inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Sí' : 'No', inline: true },
        { name: '📅 Cuenta creada', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '📥 Se unió', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '🎨 Color', value: member.displayHexColor || '#000000', inline: true },
        { name: '💎 Boost', value: member.premiumSince ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>` : 'No', inline: true },
        { name: `🎭 Roles (${roles.size})`, value: roles.size > 0 ? roles.first(10).join(', ') + (roles.size > 10 ? `... +${roles.size - 10}` : '') : 'Ninguno' },
        { name: '🏅 Rol más alto', value: member.roles.highest.toString(), inline: true },
      );
    if (user.bannerURL()) embed.setImage(user.bannerURL({ size: 1024 }));
    interaction.reply({ embeds: [embed] });
  },
};
