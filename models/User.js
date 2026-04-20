const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  warns: [{
    reason: String,
    moderator: String,
    date: { type: Date, default: Date.now },
  }],
  muted: { type: Boolean, default: false },
  mutedUntil: Date,
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  bank: { type: Number, default: 0 },
  lastDaily: Date,
  lastWork: Date,
  lastRob: Date,
  reputation: { type: Number, default: 0 },
  lastRep: Date,
  marriages: [String],
  bio: String,
  badges: [String],
}, { timestamps: true });

userSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
