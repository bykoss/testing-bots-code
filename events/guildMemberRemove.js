const { Events, EmbedBuilder } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
    const settings = await GuildSettings.findOne({ guildId: member.guild.id });
    if (!settings?.leaveChannel) return;

    const channel = member.guild.channels.cache.get(settings.leaveChannel);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor('#ED4245')
      .setTitle('👋 Adiós')
      .setDescription(
        settings.leaveMessage
          ?.replace('{user}', member.user.tag)
          .replace('{server}', member.guild.name)
        || `**${member.user.tag}** salió del servidor.`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: `Ahora somos ${member.guild.memberCount} miembros` })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  },
};
