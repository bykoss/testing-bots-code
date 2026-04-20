const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Traduce texto a otro idioma')
    .addStringOption(o => o.setName('texto').setDescription('Texto a traducir').setRequired(true))
    .addStringOption(o => o.setName('idioma').setDescription('Idioma destino (ej: en, es, fr, de, ja)').setRequired(true)),
  cooldown: 5,
  async execute(interaction) {
    await interaction.deferReply();
    const texto = interaction.options.getString('texto');
    const idioma = interaction.options.getString('idioma');

    try {
      const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${idioma}&dt=t&q=${encodeURIComponent(texto)}`);
      const traduccion = res.data[0].map(s => s[0]).join('');
      const detectedLang = res.data[2];

      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('🌐 Traducción')
        .addFields(
          { name: `📝 Original (${detectedLang || 'auto'})`, value: texto },
          { name: `🌍 Traducción (${idioma})`, value: traduccion },
        );
      interaction.editReply({ embeds: [embed] });
    } catch {
      interaction.editReply({ content: '❌ No pude traducir ese texto.' });
    }
  },
};
