const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-nsfw')
    .setDescription('Activa o desactiva NSFW en un canal')
    .addChannelOption(o => o.setName('canal').setDescription('Canal'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 5,
  async execute(interaction) {
    const canal = interaction.options.getChannel('canal') || interaction.channel;
    if (!canal.isTextBased()) return interaction.reply({ embeds: [errorEmbed('Solo funciona en canales de texto.')], ephemeral: true });
    await canal.setNSFW(!canal.nsfw);
    interaction.reply({ embeds: [successEmbed(`NSFW en ${canal} ${canal.nsfw ? '**activado**' : '**desactivado**'}.`)] });
  },
};
