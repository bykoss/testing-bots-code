const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-topic')
    .setDescription('Cambia el tema de un canal de texto')
    .addStringOption(o => o.setName('tema').setDescription('Nuevo tema').setRequired(true))
    .addChannelOption(o => o.setName('canal').setDescription('Canal (por defecto el actual)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 5,
  async execute(interaction) {
    const canal = interaction.options.getChannel('canal') || interaction.channel;
    const tema = interaction.options.getString('tema');
    await canal.setTopic(tema);
    interaction.reply({ embeds: [successEmbed(`Tema de ${canal} actualizado a: **${tema}**`)] });
  },
};
