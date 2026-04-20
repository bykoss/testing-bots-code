const { Events, AuditLogEvent } = require('discord.js');
const config = require('../config.json');
const { logAction } = require('../utils/logger');
const GuildSettings = require('../models/GuildSettings');

function trackAction(client, guildId, userId, type) {
  const key = `${guildId}-${userId}-${type}`;
  if (!client.antiNuke.has(key)) client.antiNuke.set(key, []);
  const actions = client.antiNuke.get(key);
  actions.push(Date.now());
  const interval = config.antiNuke.interval || 10000;
  const filtered = actions.filter(t => Date.now() - t < interval);
  client.antiNuke.set(key, filtered);
  return filtered.length;
}

async function punish(guild, userId, reason) {
  try {
    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;
    if (member.roles.highest.position >= guild.members.me.roles.highest.position) return;
    await member.ban({ reason: `🛡️ AntiNuke: ${reason}` });
  } catch (e) {}
}

module.exports = [
  {
    name: Events.GuildBanAdd,
    async execute(ban, client) {
      const settings = await GuildSettings.findOne({ guildId: ban.guild.id });
      const cfg = settings?.antiNuke || config.antiNuke;
      if (!cfg?.enabled) return;

      const logs = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 }).catch(() => null);
      const executor = logs?.entries.first()?.executor;
      if (!executor || executor.id === client.user.id) return;

      const count = trackAction(client, ban.guild.id, executor.id, 'ban');
      if (count >= (cfg.maxBans || 5)) {
        await punish(ban.guild, executor.id, `${count} bans en poco tiempo`);
        await logAction(client, 'antinuke', { Tipo: 'Mass Ban', Ejecutor: executor.tag, Acciones: count });
      }
    },
  },
  {
    name: Events.GuildMemberRemove,
    async execute(member, client) {
      const settings = await GuildSettings.findOne({ guildId: member.guild.id });
      const cfg = settings?.antiNuke || config.antiNuke;
      if (!cfg?.enabled) return;

      const logs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 }).catch(() => null);
      const entry = logs?.entries.first();
      if (!entry || entry.target?.id !== member.id) return;
      const executor = entry.executor;
      if (!executor || executor.id === client.user.id) return;

      const count = trackAction(client, member.guild.id, executor.id, 'kick');
      if (count >= (cfg.maxKicks || 5)) {
        await punish(member.guild, executor.id, `${count} kicks en poco tiempo`);
        await logAction(client, 'antinuke', { Tipo: 'Mass Kick', Ejecutor: executor.tag, Acciones: count });
      }
    },
  },
  {
    name: Events.ChannelDelete,
    async execute(channel, client) {
      if (!channel.guild) return;
      const settings = await GuildSettings.findOne({ guildId: channel.guild.id });
      const cfg = settings?.antiNuke || config.antiNuke;
      if (!cfg?.enabled) return;

      const logs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 }).catch(() => null);
      const executor = logs?.entries.first()?.executor;
      if (!executor || executor.id === client.user.id) return;

      const count = trackAction(client, channel.guild.id, executor.id, 'channelDelete');
      if (count >= (cfg.maxChannelDeletes || 3)) {
        await punish(channel.guild, executor.id, `${count} canales eliminados`);
        await logAction(client, 'antinuke', { Tipo: 'Channel Delete', Ejecutor: executor.tag, Acciones: count });
      }
    },
  },
  {
    name: Events.RoleDelete,
    async execute(role, client) {
      const settings = await GuildSettings.findOne({ guildId: role.guild.id });
      const cfg = settings?.antiNuke || config.antiNuke;
      if (!cfg?.enabled) return;

      const logs = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 }).catch(() => null);
      const executor = logs?.entries.first()?.executor;
      if (!executor || executor.id === client.user.id) return;

      const count = trackAction(client, role.guild.id, executor.id, 'roleDelete');
      if (count >= (cfg.maxRoleDeletes || 3)) {
        await punish(role.guild, executor.id, `${count} roles eliminados`);
        await logAction(client, 'antinuke', { Tipo: 'Role Delete', Ejecutor: executor.tag, Acciones: count });
      }
    },
  },
];
