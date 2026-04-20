const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  prefix: { type: String, default: '!' },
  welcomeChannel: String,
  welcomeMessage: String,
  leaveChannel: String,
  leaveMessage: String,
  logChannel: String,
  autoRole: String,
  muteRole: String,
  embedColor: { type: String, default: '#5865F2' },
  language: { type: String, default: 'es' },
  antiNuke: {
    enabled: { type: Boolean, default: true },
    maxBans: { type: Number, default: 5 },
    maxKicks: { type: Number, default: 5 },
    maxChannelDeletes: { type: Number, default: 3 },
    maxRoleDeletes: { type: Number, default: 3 },
    interval: { type: Number, default: 10000 },
    whitelist: [String],
  },
  antiRaid: {
    enabled: { type: Boolean, default: true },
    joinThreshold: { type: Number, default: 10 },
    joinInterval: { type: Number, default: 5000 },
    action: { type: String, default: 'kick' },
  },
  antiSpam: {
    enabled: { type: Boolean, default: false },
    maxMessages: { type: Number, default: 5 },
    interval: { type: Number, default: 3000 },
    action: { type: String, default: 'mute' },
  },
  ticketCategory: String,
  ticketLogChannel: String,
  ticketMessage: String,
  levelSystem: { type: Boolean, default: false },
  levelChannel: String,
  levelMessage: String,
  economyEnabled: { type: Boolean, default: false },
  currencySymbol: { type: String, default: '💰' },
}, { timestamps: true });

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
