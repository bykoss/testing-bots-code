const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const GuildSettings = require('../../models/GuildSettings');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antiraid')
    .setDescription('Configura el sistema AntiRaid')
    .addSubcommand(s => s.setName('toggle').setDescription('Activa/desactiva el AntiRaid'))
    .addSubcommand(s => s.setName('config').setDescription('Configura los parámetros')
      .addIntegerOption(o => o.setName('threshold').setDescription('Joins para activar').setMinValue(2).setMaxValue(50))
      .addIntegerOption(o => o.setName('intervalo').setDescription('Intervalo en ms').setMinValue(1000).setMaxValue(60000))
      .addStringOption(o => o.setName('accion').setDescription('Acción a tomar').addChoices(
        { name: 'Kick', value: 'kick' },
        { name: 'Ban', value: 'ban' },
      )))
    .addSubcommand(s => s.setName('status').setDescription('Ver estado del AntiRaid'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  cooldown: 5,
  async execute(interaction) {
    let settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!settings) settings = await GuildSettings.create({ guildId: interaction.guild.id });

    const sub = interaction.options.getSubcommand();

    if (sub === 'toggle') {
      settings.antiRaid.enabled = !settings.antiRaid.enabled;
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`AntiRaid ${settings.antiRaid.enabled ? '**activado** ✅' : '**desactivado** ❌'}.`)] });
    }

    if (sub === 'config') {
      const threshold = interaction.options.getInteger('threshold');
      const intervalo = interaction.options.getInteger('intervalo');
      const accion = interaction.options.getString('accion');
      if (threshold) settings.antiRaid.joinThreshold = threshold;
      if (intervalo) settings.antiRaid.joinInterval = intervalo;
      if (accion) settings.antiRaid.action = accion;
      await settings.save();
      return interaction.reply({ embeds: [successEmbed('Configuración de AntiRaid actualizada.')] });
    }

    if (sub === 'status') {
      const ar = settings.antiRaid;
      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('🛡️ Estado del AntiRaid')
        .addFields(
          { name: 'Estado', value: ar.enabled ? '✅ Activado' : '❌ Desactivado', inline: true },
          { name: 'Umbral de joins', value: `${ar.joinThreshold}`, inline: true },
          { name: 'Intervalo', value: `${ar.joinInterval}ms`, inline: true },
          { name: 'Acción', value: ar.action?.toUpperCase() || 'KICK', inline: true },
        );
      return interaction.reply({ embeds: [embed] });
    }
  },
};
