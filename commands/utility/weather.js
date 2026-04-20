const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Clima de una ciudad')
    .addStringOption(o => o.setName('ciudad').setDescription('Nombre de la ciudad').setRequired(true)),
  cooldown: 10,
  async execute(interaction) {
    await interaction.deferReply();
    const city = interaction.options.getString('ciudad');
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) return interaction.editReply({ content: '❌ No hay API key de clima configurada (WEATHER_API_KEY).' });

    try {
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`);
      const d = res.data;
      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`🌤️ Clima en ${d.name}, ${d.sys.country}`)
        .setThumbnail(`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`)
        .addFields(
          { name: '🌡️ Temperatura', value: `${d.main.temp}°C (sensación ${d.main.feels_like}°C)`, inline: true },
          { name: '💧 Humedad', value: `${d.main.humidity}%`, inline: true },
          { name: '💨 Viento', value: `${d.wind.speed} m/s`, inline: true },
          { name: '☁️ Condición', value: d.weather[0].description, inline: true },
          { name: '👁️ Visibilidad', value: `${(d.visibility / 1000).toFixed(1)} km`, inline: true },
          { name: '📊 Presión', value: `${d.main.pressure} hPa`, inline: true },
        );
      interaction.editReply({ embeds: [embed] });
    } catch {
      interaction.editReply({ content: `❌ No encontré el clima para **${city}**.` });
    }
  },
};
