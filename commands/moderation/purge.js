const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Elimina mensajes del canal')
    .addIntegerOption(o => o.setName('cantidad').setDescription('Cantidad de mensajes (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('usuario').setDescription('Filtrar por usuario'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  cooldown: 5,
  async execute(interaction) {
    const amount = interaction.options.getInteger('cantidad');
    const targetUser = interaction.options.getUser('usuario');

    await interaction.deferReply({ ephemeral: true });

    let messages = await interaction.channel.messages.fetch({ limit: 100 });
    if (targetUser) messages = messages.filter(m => m.author.id === targetUser.id);
    messages = [...messages.values()].slice(0, amount);

    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const deletable = messages.filter(m => m.createdTimestamp > twoWeeksAgo);

    if (deletable.length === 0) return interaction.editReply({ embeds: [errorEmbed('No hay mensajes eliminables (máx 14 días).')] });

    const deleted = await interaction.channel.bulkDelete(deletable, true);
    interaction.editReply({ embeds: [successEmbed(`Se eliminaron **${deleted.size}** mensaje(s).`)] });
  },
};
