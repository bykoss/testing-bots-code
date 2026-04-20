const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Envía un anuncio a un canal')
    .addStringOption(o => o.setName('mensaje').setDescription('Mensaje del anuncio').setRequired(true))
    .addChannelOption(o => o.setName('canal').setDescription('Canal destino'))
    .addStringOption(o => o.setName('titulo').setDescription('Título del embed'))
    .addBooleanOption(o => o.setName('everyone').setDescription('Mencionar @everyone'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  cooldown: 10,
  async execute(interaction) {
    const message = interaction.options.getString('mensaje');
    const channel = interaction.options.getChannel('canal') || interaction.channel;
    const title = interaction.options.getString('titulo') || '📢 Anuncio';
    const everyone = interaction.options.getBoolean('everyone');

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(title)
      .setDescription(message)
      .setFooter({ text: `Anunciado por ${interaction.user.tag}` })
      .setTimestamp();

    await channel.send({ content: everyone ? '@everyone' : null, embeds: [embed] });
    interaction.reply({ embeds: [{ description: `✅ Anuncio enviado en ${channel}.`, color: parseInt(config.successColor.replace('#', ''), 16) }], ephemeral: true });
  },
};
