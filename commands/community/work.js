const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');
const config = require('../../config.json');

const trabajos = [
  'trabajaste como programador', 'vendiste limonada', 'diste clases de música',
  'repartiste pizzas', 'trabajaste de cajero', 'limpiaste ventanas', 'paseaste perros',
  'vendiste arte en línea', 'hiciste streaming', 'reparaste computadoras',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Trabaja para ganar monedas'),
  cooldown: 3,
  async execute(interaction) {
    let userData = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!userData) userData = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });

    const now = new Date();
    if (userData.lastWork) {
      const diff = now - userData.lastWork;
      if (diff < 3600000) {
        const remaining = Math.ceil((3600000 - diff) / 60000);
        return interaction.reply({ embeds: [errorEmbed(`Estás cansado. Descansa **${remaining} min** más.`)], ephemeral: true });
      }
    }

    const earned = Math.floor(Math.random() * 200) + 50;
    const trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
    userData.balance += earned;
    userData.lastWork = now;
    await userData.save();

    const embed = new EmbedBuilder()
      .setColor(config.successColor)
      .setTitle('💼 ¡Buen trabajo!')
      .setDescription(`Hoy ${trabajo} y ganaste **${earned} monedas**.\nBalance: **${userData.balance}**`);
    interaction.reply({ embeds: [embed] });
  },
};
