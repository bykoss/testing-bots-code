const { Events } = require('discord.js');
const config = require('../config.json');
const { logAction } = require('../utils/logger');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member, client) {
    const settings = await GuildSettings.findOne({ guildId: member.guild.id });
    const antiRaidCfg = settings?.antiRaid || config.antiRaid;

    if (!antiRaidCfg?.enabled) return;

    const guildId = member.guild.id;
    if (!client.antiRaid.has(guildId)) client.antiRaid.set(guildId, []);

    const joins = client.antiRaid.get(guildId);
    joins.push(Date.now());

    // Clean joins outside interval
    const interval = antiRaidCfg.joinInterval || 5000;
    const filtered = joins.filter(t => Date.now() - t < interval);
    client.antiRaid.set(guildId, filtered);

    if (filtered.length >= (antiRaidCfg.joinThreshold || 10)) {
      client.antiRaid.set(guildId, []);

      const action = antiRaidCfg.action || 'kick';
      const recentMembers = member.guild.members.cache
        .filter(m => Date.now() - m.joinedTimestamp < interval)
        .first(antiRaidCfg.joinThreshold);

      for (const [, m] of recentMembers) {
        if (action === 'kick') await m.kick('🛡️ AntiRaid activado').catch(() => {});
        if (action === 'ban') await m.ban({ reason: '🛡️ AntiRaid activado' }).catch(() => {});
      }

      await logAction(client, 'antiraid', {
        'Servidor': member.guild.name,
        'Acción': action.toUpperCase(),
        'Miembros afectados': recentMembers.size,
        'Intervalo': `${interval}ms`,
      });
    }

    // Welcome message
    if (settings?.welcomeChannel) {
      const channel = member.guild.channels.cache.get(settings.welcomeChannel);
      if (channel) {
        const { EmbedBuilder } = require('discord.js');
        const embed = new EmbedBuilder()
          .setColor('#57F287')
          .setTitle('👋 ¡Bienvenido!')
          .setDescription(settings.welcomeMessage?.replace('{user}', member.toString()).replace('{server}', member.guild.name) || `¡Bienvenido ${member}!`)
          .setThumbnail(member.user.displayAvatarURL())
          .setFooter({ text: `Miembro #${member.guild.memberCount}` })
          .setTimestamp();
        channel.send({ embeds: [embed] }).catch(() => {});
      }
    }

    // Auto role
    if (settings?.autoRole) {
      const role = member.guild.roles.cache.get(settings.autoRole);
      if (role) member.roles.add(role).catch(() => {});
    }
  },
};
