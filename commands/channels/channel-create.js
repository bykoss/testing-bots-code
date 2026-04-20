const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-create')
    .setDescription('Crea un nuevo canal')
    .addStringOption(o => o.setName('nombre').setDescription('Nombre del canal').setRequired(true))
    .addStringOption(o => o.setName('tipo').setDescription('Tipo de canal').addChoices(
      { name: 'Texto', value: 'text' },
      { name: 'Voz', value: 'voice' },
      { name: 'Anuncios', value: 'news' },
      { name: 'Stage', value: 'stage' },
    ))
    .addStringOption(o => o.setName('categoria').setDescription('ID de la categoría'))
    .addStringOption(o => o.setName('tema').setDescription('Tema del canal'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 5,
  async execute(interaction) {
    const name = interaction.options.getString('nombre');
    const tipo = interaction.options.getString('tipo') || 'text';
    const categoriaId = interaction.options.getString('categoria');
    const topic = interaction.options.getString('tema');

    const typeMap = { text: ChannelType.GuildText, voice: ChannelType.GuildVoice, news: ChannelType.GuildAnnouncement, stage: ChannelType.GuildStageVoice };

    const options = { name, type: typeMap[tipo] };
    if (categoriaId) options.parent = categoriaId;
    if (topic && tipo === 'text') options.topic = topic;

    const channel = await interaction.guild.channels.create(options).catch(e => null);
    if (!channel) return interaction.reply({ embeds: [errorEmbed('No pude crear el canal.')], ephemeral: true });

    interaction.reply({ embeds: [successEmbed(`Canal ${channel} creado exitosamente.`)] });
  },
};
