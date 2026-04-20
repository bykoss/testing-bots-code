const { SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const { isOwner } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription('[OWNER] Cambia el estado del bot')
    .addStringOption(o => o.setName('texto').setDescription('Texto del estado').setRequired(true))
    .addStringOption(o => o.setName('tipo').setDescription('Tipo').addChoices(
      { name: 'Playing', value: 'playing' },
      { name: 'Watching', value: 'watching' },
      { name: 'Listening', value: 'listening' },
      { name: 'Competing', value: 'competing' },
    ))
    .addStringOption(o => o.setName('presencia').setDescription('Presencia').addChoices(
      { name: 'Online', value: 'online' },
      { name: 'Idle', value: 'idle' },
      { name: 'DND', value: 'dnd' },
      { name: 'Invisible', value: 'invisible' },
    )),
  cooldown: 5,
  async execute(interaction, client) {
    if (!isOwner(interaction.user.id))
      return interaction.reply({ content: '❌ Solo el dueño puede usar este comando.', ephemeral: true });

    const texto = interaction.options.getString('texto');
    const tipo = interaction.options.getString('tipo') || 'playing';
    const presencia = interaction.options.getString('presencia') || 'online';

    const typeMap = { playing: ActivityType.Playing, watching: ActivityType.Watching, listening: ActivityType.Listening, competing: ActivityType.Competing };

    client.user.setPresence({ activities: [{ name: texto, type: typeMap[tipo] }], status: presencia });
    interaction.reply({ content: `✅ Estado actualizado: **${tipo} ${texto}**`, ephemeral: true });
  },
};
