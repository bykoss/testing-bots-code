const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { version } = require('discord.js');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Muestra información del bot'),
  cooldown: 10,
  async execute(interaction, client) {
    const uptime = process.uptime();
    const d = Math.floor(uptime / 86400);
    const h = Math.floor((uptime % 86400) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${d}d ${h}h ${m}m ${s}s`;

    const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`🤖 ${client.user.tag}`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '⏱️ Uptime', value: uptimeStr, inline: true },
        { name: '📡 Ping', value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: '💾 RAM', value: `${memUsed}MB / ${totalMem}GB`, inline: true },
        { name: '🖥️ Node.js', value: process.version, inline: true },
        { name: '📦 Discord.js', value: `v${version}`, inline: true },
        { name: '🌐 Servidores', value: `${client.guilds.cache.size}`, inline: true },
        { name: '👥 Usuarios', value: `${client.users.cache.size}`, inline: true },
        { name: '⚡ Comandos', value: `${client.commands.size}`, inline: true },
        { name: '💬 Canales', value: `${client.channels.cache.size}`, inline: true },
      )
      .setFooter({ text: 'Bot hecho con discord.js v14' })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
