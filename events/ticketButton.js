const { Events, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');
const config = require('../config.json');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'ticket_create') return;

    const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    const existing = interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.username.toLowerCase()}`);
    if (existing) return interaction.reply({ content: `❌ Ya tienes un ticket abierto: ${existing}`, ephemeral: true });

    const options = {
      name: `ticket-${interaction.user.username.toLowerCase()}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
      ],
    };
    if (settings?.ticketCategory) options.parent = settings.ticketCategory;

    const channel = await interaction.guild.channels.create(options).catch(() => null);
    if (!channel) return interaction.reply({ content: '❌ No pude crear el ticket.', ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('🎫 Ticket Creado')
      .setDescription(`Hola ${interaction.user}, bienvenido a tu ticket.\nDescribe tu problema y el staff te atenderá pronto.`)
      .setFooter({ text: 'Usa /ticket close para cerrar este ticket' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket_close_btn').setLabel('Cerrar Ticket').setEmoji('🔒').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
    interaction.reply({ content: `✅ Ticket creado: ${channel}`, ephemeral: true });
  },
};
