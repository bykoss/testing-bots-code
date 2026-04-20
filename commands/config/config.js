const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const GuildSettings = require('../../models/GuildSettings');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configura el bot en el servidor')
    .addSubcommand(s => s.setName('welcome')
      .setDescription('Canal y mensaje de bienvenida')
      .addChannelOption(o => o.setName('canal').setDescription('Canal de bienvenida').setRequired(true))
      .addStringOption(o => o.setName('mensaje').setDescription('Mensaje ({user} = mención, {server} = servidor)')))
    .addSubcommand(s => s.setName('leave')
      .setDescription('Canal y mensaje de despedida')
      .addChannelOption(o => o.setName('canal').setDescription('Canal de despedida').setRequired(true))
      .addStringOption(o => o.setName('mensaje').setDescription('Mensaje ({user} = nombre, {server} = servidor)')))
    .addSubcommand(s => s.setName('logs')
      .setDescription('Canal de logs del bot')
      .addChannelOption(o => o.setName('canal').setDescription('Canal de logs').setRequired(true)))
    .addSubcommand(s => s.setName('autorole')
      .setDescription('Rol automático al entrar')
      .addRoleOption(o => o.setName('rol').setDescription('Rol a asignar (vacío para desactivar)')))
    .addSubcommand(s => s.setName('muterole')
      .setDescription('Rol de mute personalizado')
      .addRoleOption(o => o.setName('rol').setDescription('Rol de mute').setRequired(true)))
    .addSubcommand(s => s.setName('view').setDescription('Ver configuración actual'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  cooldown: 5,
  async execute(interaction) {
    let settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!settings) settings = await GuildSettings.create({ guildId: interaction.guild.id });

    const sub = interaction.options.getSubcommand();

    if (sub === 'welcome') {
      settings.welcomeChannel = interaction.options.getChannel('canal').id;
      settings.welcomeMessage = interaction.options.getString('mensaje') || '¡Bienvenido {user} a {server}!';
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`Canal de bienvenida: ${interaction.options.getChannel('canal')}`)] });
    }
    if (sub === 'leave') {
      settings.leaveChannel = interaction.options.getChannel('canal').id;
      settings.leaveMessage = interaction.options.getString('mensaje') || '**{user}** salió de {server}.';
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`Canal de despedida configurado.`)] });
    }
    if (sub === 'logs') {
      settings.logChannel = interaction.options.getChannel('canal').id;
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`Canal de logs: ${interaction.options.getChannel('canal')}`)] });
    }
    if (sub === 'autorole') {
      const rol = interaction.options.getRole('rol');
      settings.autoRole = rol?.id || null;
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(rol ? `AutoRole configurado: ${rol}` : 'AutoRole desactivado.')] });
    }
    if (sub === 'muterole') {
      settings.muteRole = interaction.options.getRole('rol').id;
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`Rol de mute: ${interaction.options.getRole('rol')}`)] });
    }
    if (sub === 'view') {
      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle(`⚙️ Configuración de ${interaction.guild.name}`)
        .setThumbnail(interaction.guild.iconURL())
        .addFields(
          { name: '👋 Bienvenida', value: settings.welcomeChannel ? `<#${settings.welcomeChannel}>` : 'No configurado', inline: true },
          { name: '🚪 Despedida', value: settings.leaveChannel ? `<#${settings.leaveChannel}>` : 'No configurado', inline: true },
          { name: '📋 Logs', value: settings.logChannel ? `<#${settings.logChannel}>` : 'No configurado', inline: true },
          { name: '🎭 AutoRole', value: settings.autoRole ? `<@&${settings.autoRole}>` : 'No configurado', inline: true },
          { name: '🔇 Rol Mute', value: settings.muteRole ? `<@&${settings.muteRole}>` : 'No configurado', inline: true },
          { name: '🛡️ AntiNuke', value: settings.antiNuke?.enabled ? '✅' : '❌', inline: true },
          { name: '🚨 AntiRaid', value: settings.antiRaid?.enabled ? '✅' : '❌', inline: true },
        );
      return interaction.reply({ embeds: [embed] });
    }
  },
};
