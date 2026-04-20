const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Lanza una moneda'),
  cooldown: 3,
  async execute(interaction) {
    const result = Math.random() < 0.5 ? '🪙 Cara' : '🪙 Cruz';
    interaction.reply({ embeds: [new EmbedBuilder().setColor(config.embedColor).setTitle('🪙 Moneda').setDescription(`Resultado: **${result}**`)] });
  },
};
