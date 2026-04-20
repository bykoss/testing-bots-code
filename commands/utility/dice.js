const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Lanza un dado')
    .addIntegerOption(o => o.setName('caras').setDescription('Número de caras (por defecto 6)').setMinValue(2).setMaxValue(100)),
  cooldown: 3,
  async execute(interaction) {
    const caras = interaction.options.getInteger('caras') || 6;
    const result = Math.floor(Math.random() * caras) + 1;
    interaction.reply({ embeds: [new EmbedBuilder().setColor(config.embedColor).setTitle(`🎲 Dado de ${caras} caras`).setDescription(`Resultado: **${result}**`)] });
  },
};
