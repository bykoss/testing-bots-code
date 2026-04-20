const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  caseId: { type: Number, required: true },
  type: { type: String, required: true, enum: ['ban', 'unban', 'kick', 'mute', 'unmute', 'warn', 'softban', 'timeout'] },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, default: 'Sin razón especificada' },
  duration: Number,
  active: { type: Boolean, default: true },
}, { timestamps: true });

caseSchema.index({ guildId: 1, caseId: 1 }, { unique: true });

module.exports = mongoose.model('Case', caseSchema);
