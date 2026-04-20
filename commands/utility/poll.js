const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Crea una encuesta')
    .addStringOption(o => o.setName('pregunta').setDescription('Pregunta de la encuesta').setRequired(true))
    .addStringOption(o => o.setName('opcion1').setDescription('Opción 1').setRequired(true))
    .addStringOption(o => o.setName('opcion2').setDescription('Opción 2').setRequired(true))
    .addStringOption(o => o.setName('opcion3').setDescription('Opción 3'))
    .addStringOption(o => o.setName('opcion4').setDescription('Opción 4'))
    .addStringOption(o => o.setName('opcion5').setDescription('Opción 5')),
  cooldown: 10,
  async execute(interaction) {
    const pregunta = interaction.options.getString('pregunta');
    const opciones = [];
    for (let i = 1; i <= 5; i++) {
      const op = interaction.options.getString(`opcion${i}`);
      if (op) opciones.push(op);
    }

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('📊 Encuesta')
      .setDescription(`**${pregunta}**\n\n${opciones.map((o, i) => `${emojis[i]} ${o}`).join('\n')}`)
      .setFooter({ text: `Encuesta creada por ${interaction.user.tag}` })
      .setTimestamp();

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < opciones.length; i++) await msg.react(emojis[i]);
  },
};
