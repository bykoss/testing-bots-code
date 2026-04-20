const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Crea y envía un embed personalizado')
    .addStringOption(o => o.setName('titulo').setDescription('Título del embed'))
    .addStringOption(o => o.setName('descripcion').setDescription('Descripción').setRequired(true))
    .addStringOption(o => o.setName('color').setDescription('Color hex (ej: #ff0000)'))
    .addStringOption(o => o.setName('imagen').setDescription('URL de imagen'))
    .addStringOption(o => o.setName('thumbnail').setDescription('URL de thumbnail'))
    .addStringOption(o => o.setName('footer').setDescription('Texto del footer'))
    .addChannelOption(o => o.setName('canal').setDescription('Canal destino'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  cooldown: 5,
  async execute(interaction) {
    const titulo = interaction.options.getString('titulo');
    const desc = interaction.options.getString('descripcion');
    const color = interaction.options.getString('color') || '#5865F2';
    const imagen = interaction.options.getString('imagen');
    const thumbnail = interaction.options.getString('thumbnail');
    const footer = interaction.options.getString('footer');
    const canal = interaction.options.getChannel('canal') || interaction.channel;

    const embed = new EmbedBuilder().setColor(color).setDescription(desc).setTimestamp();
    if (titulo) embed.setTitle(titulo);
    if (imagen) embed.setImage(imagen);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (footer) embed.setFooter({ text: footer });

    await canal.send({ embeds: [embed] });
    interaction.reply({ content: `✅ Embed enviado en ${canal}.`, ephemeral: true });
  },
};
