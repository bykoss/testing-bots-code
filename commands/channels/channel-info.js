const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const config = require('../../config.json');

const typeNames = {
  [ChannelType.GuildText]: '💬 Texto',
  [ChannelType.GuildVoice]: '🔊 Voz',
  [ChannelType.GuildAnnouncement]: '📢 Anuncios',
  [ChannelType.GuildStageVoice]: '🎙️ Stage',
  [ChannelType.GuildForum]: '📋 Foro',
  [ChannelType.GuildCategory]: '📁 Categoría',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-info')
    .setDescription('Muestra info de un canal')
    .addChannelOption(o => o.setName('canal').setDescription('Canal'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 5,
  async execute(interaction) {
    const canal = interaction.options.getChannel('canal') || interaction.channel;
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`📌 Info de #${canal.name}`)
      .addFields(
        { name: 'ID', value: canal.id, inline: true },
        { name: 'Tipo', value: typeNames[canal.type] || 'Desconocido', inline: true },
        { name: 'Creado', value: `<t:${Math.floor(canal.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Categoría', value: canal.parent?.name || 'Ninguna', inline: true },
        { name: 'Posición', value: `${canal.rawPosition}`, inline: true },
        { name: 'NSFW', value: canal.nsfw ? 'Sí' : 'No', inline: true },
      );
    if (canal.topic) embed.addFields({ name: 'Tema', value: canal.topic });
    interaction.reply({ embeds: [embed] });
  },
};
