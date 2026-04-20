const config = require('../config.json');

function isOwner(userId) {
  return config.ownerIds.includes(userId);
}

function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

function checkBotPermissions(channel, permissions) {
  const botMember = channel.guild.members.cache.get(channel.client.user.id);
  return permissions.every(p => botMember.permissionsIn(channel).has(p));
}

module.exports = { isOwner, hasPermission, checkBotPermissions };
