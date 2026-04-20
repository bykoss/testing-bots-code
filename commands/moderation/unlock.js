const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Desbloquea el canal')
    .addChannelOption(o => o.setName('canal').setDescription('Canal a desbloquear'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  cooldown: 3,
  async execute(interaction) {
    const channel = interaction.options.getChannel('canal') || interaction.channel;
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    interaction.reply({ embeds: [successEmbed(`🔓 ${channel} ha sido **desbloqueado**.`)] });
  },
};
