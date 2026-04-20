const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Top usuarios del servidor')
    .addStringOption(o => o.setName('tipo').setDescription('Tipo').addChoices(
      { name: '💰 Riqueza', value: 'balance' },
      { name: '⭐ Reputación', value: 'reputation' },
      { name: '📊 Nivel', value: 'level' },
    )),
  cooldown: 10,
  async execute(interaction) {
    await interaction.deferReply();
    const tipo = interaction.options.getString('tipo') || 'balance';
    const users = await User.find({ guildId: interaction.guild.id }).sort({ [tipo]: -1 }).limit(10);

    const medals = ['🥇', '🥈', '🥉'];
    const titles = { balance: '💰 Top Riqueza', reputation: '⭐ Top Reputación', level: '📊 Top Nivel' };

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(titles[tipo])
      .setDescription(
        users.length === 0
          ? 'No hay datos aún.'
          : (await Promise.all(users.map(async (u, i) => {
              const discordUser = await interaction.client.users.fetch(u.userId).catch(() => null);
              const name = discordUser?.tag || u.userId;
              const value = tipo === 'balance' ? `${u.balance + u.bank} monedas` : tipo === 'reputation' ? `${u.reputation} ⭐` : `Nivel ${u.level}`;
              return `${medals[i] || `**${i + 1}.**`} ${name} — ${value}`;
            }))).join('\n')
      )
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  },
};
