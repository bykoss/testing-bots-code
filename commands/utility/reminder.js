const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reminder')
    .setDescription('Establece un recordatorio')
    .addStringOption(o => o.setName('tiempo').setDescription('Tiempo (ej: 10m, 1h, 2d)').setRequired(true))
    .addStringOption(o => o.setName('recordatorio').setDescription('¿Qué debo recordarte?').setRequired(true)),
  cooldown: 5,
  async execute(interaction) {
    const tiempoStr = interaction.options.getString('tiempo');
    const texto = interaction.options.getString('recordatorio');
    const tiempo = ms(tiempoStr);

    if (!tiempo || tiempo > ms('7d')) return interaction.reply({ content: '❌ Tiempo inválido. Máximo 7 días.', ephemeral: true });

    const timestamp = Math.floor((Date.now() + tiempo) / 1000);
    await interaction.reply({ embeds: [new EmbedBuilder().setColor(config.successColor).setDescription(`⏰ Recordatorio establecido para <t:${timestamp}:R>\n> **${texto}**`)] });

    setTimeout(async () => {
      interaction.user.send({ embeds: [new EmbedBuilder().setColor(config.embedColor).setTitle('⏰ Recordatorio').setDescription(texto).setFooter({ text: `Establecido en ${interaction.guild.name}` })] }).catch(() => {
        interaction.channel.send({ content: `${interaction.user}, ⏰ **Recordatorio:** ${texto}` }).catch(() => {});
      });
    }, tiempo);
  },
};
