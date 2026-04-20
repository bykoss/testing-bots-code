const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../config.json');

const categories = {
  moderation: { emoji: '🔨', name: 'Moderación', desc: 'ban, kick, mute, warn, purge...' },
  channels: { emoji: '📁', name: 'Canales', desc: 'create, delete, rename, clone...' },
  antinuke: { emoji: '🔐', name: 'AntiNuke', desc: 'Sistema de protección contra nukes' },
  antiraid: { emoji: '🛡️', name: 'AntiRaid', desc: 'Sistema de protección contra raids' },
  config: { emoji: '⚙️', name: 'Configuración', desc: 'welcome, logs, autorole...' },
  general: { emoji: '🌐', name: 'General', desc: 'info, ping, avatar, userinfo...' },
  utility: { emoji: '🔧', name: 'Utilidades', desc: 'embed, poll, reminder, calc...' },
  community: { emoji: '👥', name: 'Comunidad', desc: 'rep, daily, suggest, ticket...' },
  roleplay: { emoji: '🎭', name: 'Roleplay', desc: 'hug, kiss, slap, pat, cry...' },
  games: { emoji: '🎮', name: 'Juegos', desc: 'ttt, rps, trivia, blackjack...' },
  admin: { emoji: '👑', name: 'Admin', desc: 'Comandos exclusivos de administradores' },
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra los comandos disponibles')
    .addStringOption(o => o.setName('categoria').setDescription('Categoría específica')),
  cooldown: 5,
  async execute(interaction, client) {
    const catArg = interaction.options.getString('categoria');

    const mainEmbed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('📚 Menú de Ayuda')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Hola **${interaction.user.username}**! Soy un bot con **${client.commands.size}** comandos slash.\nSelecciona una categoría del menú para ver sus comandos.`)
      .addFields(
        Object.values(categories).map(c => ({ name: `${c.emoji} ${c.name}`, value: c.desc, inline: true }))
      )
      .setFooter({ text: `${client.commands.size} comandos totales • Usa el menú para explorar` });

    const menu = new StringSelectMenuBuilder()
      .setCustomId('help_menu')
      .setPlaceholder('📂 Selecciona una categoría...')
      .addOptions(
        Object.entries(categories).map(([key, val]) => ({
          label: val.name,
          value: key,
          emoji: val.emoji,
          description: val.desc,
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);
    const reply = await interaction.reply({ embeds: [mainEmbed], components: [row], fetchReply: true });

    const collector = reply.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: 'No puedes usar este menú.', ephemeral: true });
      const cat = i.values[0];
      const catCommands = client.commands.filter(c => {
        const path = require.resolve(`../${cat}/${c.data.name}.js`).replace(/\\/g, '/');
        return path.includes(`/commands/${cat}/`);
      });

      const catEmbed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`${categories[cat]?.emoji} ${categories[cat]?.name}`)
        .setDescription(catCommands.map(c => `\`/${c.data.name}\` - ${c.data.description}`).join('\n') || 'Sin comandos en esta categoría.')
        .setFooter({ text: 'Usa /help para volver' });

      await i.update({ embeds: [catEmbed], components: [row] });
    });

    collector.on('end', () => {
      reply.edit({ components: [] }).catch(() => {});
    });
  },
};
