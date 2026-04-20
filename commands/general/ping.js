const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Muestra la latencia del bot'),
  cooldown: 5,
  async execute(interaction, client) {
    const sent = await interaction.reply({ content: '🏓 Calculando...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '📡 Latencia', value: `${latency}ms`, inline: true },
        { name: '💓 API', value: `${Math.round(client.ws.ping)}ms`, inline: true },
      );
    interaction.editReply({ content: null, embeds: [embed] });
  },
};
