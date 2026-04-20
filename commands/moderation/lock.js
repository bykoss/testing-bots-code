const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Bloquea el canal para que nadie pueda escribir')
    .addChannelOption(o => o.setName('canal').setDescription('Canal a bloquear (por defecto el actual)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 3,
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal') || interaction.channel;
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    interaction.reply({ embeds: [successEmbed(`🔒 ${channel} ha sido **bloqueado**.`)] });
  },
};
