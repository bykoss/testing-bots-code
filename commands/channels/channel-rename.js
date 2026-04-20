const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-rename')
    .setDescription('Renombra un canal')
    .addChannelOption(o => o.setName('canal').setDescription('Canal').setRequired(true))
    .addStringOption(o => o.setName('nombre').setDescription('Nuevo nombre').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 5,
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal');
    const newName = interaction.options.getString('nombre');
    const oldName = channel.name;
    await channel.setName(newName);
    interaction.reply({ embeds: [successEmbed(`Canal renombrado: **#${oldName}** → **#${newName}**`)] });
  },
};
