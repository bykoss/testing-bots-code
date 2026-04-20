const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

const respuestas = [
  '✅ Sí, definitivamente.', '✅ Es cierto.', '✅ Sin duda alguna.', '✅ Puedes contar con ello.',
  '✅ Lo más probable es que sí.', '✅ Las perspectivas son buenas.', '✅ Sí.',
  '🤔 Pregunta en otro momento.', '🤔 No puedo predecirlo ahora.', '🤔 Mejor no decirte.',
  '🤔 Concéntrate y pregunta de nuevo.', '🤔 Es incierto.',
  '❌ No cuentes con ello.', '❌ Mi respuesta es no.', '❌ Las perspectivas no son buenas.',
  '❌ Muy dudoso.', '❌ No.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Pregunta a la bola mágica')
    .addStringOption(o => o.setName('pregunta').setDescription('Tu pregunta').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    const pregunta = interaction.options.getString('pregunta');
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🎱 Bola Mágica')
      .addFields(
        { name: '❓ Pregunta', value: pregunta },
        { name: '🎱 Respuesta', value: respuesta },
      );
    interaction.reply({ embeds: [embed] });
  },
};
