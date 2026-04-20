const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const GuildSettings = require('../../models/GuildSettings');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Sistema de tickets')
    .addSubcommand(s => s.setName('setup').setDescription('Configura el panel de tickets')
      .addChannelOption(o => o.setName('canal').setDescription('Canal para el panel').setRequired(true))
      .addStringOption(o => o.setName('categoria').setDescription('ID de categoría para los tickets')))
    .addSubcommand(s => s.setName('close').setDescription('Cierra el ticket actual'))
    .addSubcommand(s => s.setName('add').setDescription('Añade usuario al ticket').addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)))
    .addSubcommand(s => s.setName('remove').setDescription('Quita usuario del ticket').addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  cooldown: 5,
  async execute(interaction, client) {
    let settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!settings) settings = await GuildSettings.create({ guildId: interaction.guild.id });

    const sub = interaction.options.getSubcommand();

    if (sub === 'setup') {
      const canal = interaction.options.getChannel('canal');
      const categoria = interaction.options.getString('categoria');
      if (categoria) settings.ticketCategory = categoria;
      settings.ticketLogChannel = canal.id;
      await settings.save();

      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('🎫 Sistema de Tickets')
        .setDescription('Haz clic en el botón de abajo para crear un ticket.\nNuestro equipo te atenderá lo antes posible.');

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket_create').setLabel('Crear Ticket').setEmoji('🎫').setStyle(ButtonStyle.Primary)
      );

      await canal.send({ embeds: [embed], components: [row] });
      return interaction.reply({ embeds: [successEmbed(`Panel de tickets enviado en ${canal}.`)], ephemeral: true });
    }

    if (sub === 'close') {
      if (!interaction.channel.name.startsWith('ticket-'))
        return interaction.reply({ embeds: [errorEmbed('Este comando solo se usa dentro de un ticket.')], ephemeral: true });

      const embed = new EmbedBuilder()
        .setColor(config.errorColor)
        .setDescription('🔒 Este ticket será cerrado en 5 segundos...');

      await interaction.reply({ embeds: [embed] });
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }

    if (sub === 'add') {
      const user = interaction.options.getMember('usuario');
      await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: true, SendMessages: true });
      interaction.reply({ embeds: [successEmbed(`${user} añadido al ticket.`)] });
    }

    if (sub === 'remove') {
      const user = interaction.options.getMember('usuario');
      await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: false });
      interaction.reply({ embeds: [successEmbed(`${user} quitado del ticket.`)] });
    }
  },
};
