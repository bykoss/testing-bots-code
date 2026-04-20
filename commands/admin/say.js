const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Haz que el bot diga algo')
    .addStringOption(o => o.setName('mensaje').setDescription('Mensaje').setRequired(true))
    .addChannelOption(o => o.setName('canal').setDescription('Canal destino'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  cooldown: 3,
  async execute(interaction) {
    const msg = interaction.options.getString('mensaje');
    const channel = interaction.options.getChannel('canal') || interaction.channel;
    await channel.send(msg).catch(() => {});
    interaction.reply({ content: '✅ Mensaje enviado.', ephemeral: true });
  },
};
