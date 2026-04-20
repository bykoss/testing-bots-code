const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Muestra información del servidor'),
  cooldown: 5,
  async execute(interaction) {
    const g = interaction.guild;
    await g.members.fetch();
    const bots = g.members.cache.filter(m => m.user.bot).size;
    const humans = g.members.cache.size - bots;
    const textChannels = g.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = g.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;

    const verificationLevels = { 0: 'Ninguno', 1: 'Bajo', 2: 'Medio', 3: 'Alto', 4: 'Muy Alto' };

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`📊 ${g.name}`)
      .setThumbnail(g.iconURL({ dynamic: true }))
      .addFields(
        { name: '👑 Dueño', value: `<@${g.ownerId}>`, inline: true },
        { name: '📅 Creado', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '🌍 Región', value: g.preferredLocale, inline: true },
        { name: '👥 Miembros', value: `${g.memberCount} (${humans} humanos / ${bots} bots)`, inline: true },
        { name: '💬 Canales', value: `${textChannels} texto / ${voiceChannels} voz`, inline: true },
        { name: '🎭 Roles', value: `${g.roles.cache.size}`, inline: true },
        { name: '📁 Categorías', value: `${g.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size}`, inline: true },
        { name: '😀 Emojis', value: `${g.emojis.cache.size}`, inline: true },
        { name: '🔒 Verificación', value: verificationLevels[g.verificationLevel], inline: true },
        { name: '🚀 Boosts', value: `Nivel ${g.premiumTier} (${g.premiumSubscriptionCount} boosts)`, inline: true },
        { name: '🆔 ID', value: g.id, inline: true },
      );
    if (g.bannerURL()) embed.setImage(g.bannerURL({ size: 1024 }));
    interaction.reply({ embeds: [embed] });
  },
};
