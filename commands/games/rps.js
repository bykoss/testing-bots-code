const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');

const options = ['🪨 Piedra', '📄 Papel', '✂️ Tijeras'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rps')
    .setDescription('Juega piedra, papel o tijeras contra el bot'),
  cooldown: 5,
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('rps_rock').setLabel('🪨 Piedra').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rps_paper').setLabel('📄 Papel').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('rps_scissors').setLabel('✂️ Tijeras').setStyle(ButtonStyle.Secondary),
    );

    const msg = await interaction.reply({ content: '¿Qué eliges?', components: [row], fetchReply: true });
    const collector = msg.createMessageComponentCollector({ filter: i => i.user.id === interaction.user.id, time: 15000, max: 1 });

    collector.on('collect', async i => {
      const choices = { rps_rock: 0, rps_paper: 1, rps_scissors: 2 };
      const playerChoice = choices[i.customId];
      const botChoice = Math.floor(Math.random() * 3);

      let result;
      if (playerChoice === botChoice) result = '🤝 **¡Empate!**';
      else if ((playerChoice - botChoice + 3) % 3 === 1) result = '🏆 **¡Ganaste!**';
      else result = '😢 **¡Perdiste!**';

      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('🎮 Piedra, Papel o Tijeras')
        .addFields(
          { name: '👤 Tú', value: options[playerChoice], inline: true },
          { name: '🤖 Bot', value: options[botChoice], inline: true },
          { name: 'Resultado', value: result },
        );
      await i.update({ content: null, embeds: [embed], components: [] });
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') msg.edit({ content: '⏰ Tiempo agotado.', components: [] }).catch(() => {});
    });
  },
};
