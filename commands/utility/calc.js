const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('Calculadora matemática')
    .addStringOption(o => o.setName('expresion').setDescription('Expresión matemática (ej: 2+2, 10*5, sqrt(16))').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const expr = interaction.options.getString('expresion');
    let result;
    try {
      // Safe eval using Function
      const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, '');
      if (!sanitized) throw new Error('Expresión inválida');
      result = Function(`"use strict"; return (${sanitized})`)();
      if (!isFinite(result)) throw new Error('Resultado infinito');
    } catch {
      return interaction.reply({ content: '❌ Expresión matemática inválida.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🧮 Calculadora')
      .addFields(
        { name: 'Expresión', value: `\`${expr}\``, inline: true },
        { name: 'Resultado', value: `\`${result}\``, inline: true },
      );
    interaction.reply({ embeds: [embed] });
  },
};
