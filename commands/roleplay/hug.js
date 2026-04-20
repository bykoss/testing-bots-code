const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

async function getGif(category) {
  try {
    const res = await axios.get(`https://nekos.best/api/v2/${category}`);
    return res.data.results[0].url;
  } catch {
    return null;
  }
}

function rpEmbed(user, target, action, emoji, gif) {
  const embed = new EmbedBuilder()
    .setColor(config.embedColor)
    .setDescription(`${emoji} **${user.username}** ${action} **${target.username}**`)
    .setTimestamp();
  if (gif) embed.setImage(gif);
  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Abraza a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getUser('usuario');
    const gif = await getGif('hug');
    interaction.reply({ embeds: [rpEmbed(interaction.user, target, 'abraza a', '🤗', gif)] });
  },
};
