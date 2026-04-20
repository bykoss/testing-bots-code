const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('choose')
    .setDescription('Elige entre varias opciones')
    .addStringOption(o => o.setName('opciones').setDescription('Opciones separadas por coma (ej: pizza, hamburguesa, tacos)').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const input = interaction.options.getString('opciones');
    const opciones = input.split(',').map(o => o.trim()).filter(Boolean);
    if (opciones.length < 2) return interaction.reply({ content: '❌ Necesitas al menos 2 opciones separadas por coma.', ephemeral: true });
    const eleccion = opciones[Math.floor(Math.random() * opciones.length)];
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🤔 Elijo...')
      .addFields(
        { name: '📋 Opciones', value: opciones.map((o, i) => `${i + 1}. ${o}`).join('\n') },
        { name: '🎯 Decisión', value: `**${eleccion}**` },
      );
    interaction.reply({ embeds: [embed] });
  },
};
