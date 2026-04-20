const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

function successEmbed(description, title = null) {
  const e = new EmbedBuilder().setColor(config.successColor).setDescription(`✅ ${description}`);
  if (title) e.setTitle(title);
  return e;
}

function errorEmbed(description, title = null) {
  const e = new EmbedBuilder().setColor(config.errorColor).setDescription(`❌ ${description}`);
  if (title) e.setTitle(title);
  return e;
}

function warnEmbed(description, title = null) {
  const e = new EmbedBuilder().setColor(config.warnColor).setDescription(`⚠️ ${description}`);
  if (title) e.setTitle(title);
  return e;
}

function infoEmbed(description, title = null) {
  const e = new EmbedBuilder().setColor(config.embedColor).setDescription(description);
  if (title) e.setTitle(title);
  return e;
}

module.exports = { successEmbed, errorEmbed, warnEmbed, infoEmbed };
