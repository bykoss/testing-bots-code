const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

async function logAction(client, type, data) {
  const logChannelId = config.logChannel || process.env.LOG_CHANNEL;
  if (!logChannelId) return;

  const channel = client.channels.cache.get(logChannelId);
  if (!channel) return;

  const colors = {
    ban: '#ED4245', kick: '#FEE75C', mute: '#FEE75C', warn: '#FEE75C',
    unban: '#57F287', unmute: '#57F287', delete: '#ED4245', antinuke: '#FF0000',
    antiraid: '#FF6600', info: '#5865F2',
  };

  const embed = new EmbedBuilder()
    .setColor(colors[type] || '#5865F2')
    .setTitle(`📋 Log: ${type.toUpperCase()}`)
    .setTimestamp();

  Object.entries(data).forEach(([k, v]) => {
    embed.addFields({ name: k, value: String(v) || 'N/A', inline: true });
  });

  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { logAction };
