const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

async function getGif(cat) {
  try {
    const res = await axios.get(`https://nekos.best/api/v2/${cat}`);
    return res.data.results[0].url;
  } catch { return null; }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pat')
    .setDescription('Acción de roleplay: acaricia a')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getUser('usuario');
    const gif = await getGif('pat');
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setDescription(`🫶 **${interaction.user.username}** acaricia a **${target.username}**`)
      .setTimestamp();
    if (gif) embed.setImage(gif);
    interaction.reply({ embeds: [embed] });
  },
};
