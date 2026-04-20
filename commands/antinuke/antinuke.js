const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const GuildSettings = require('../../models/GuildSettings');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('antinuke')
    .setDescription('Configura el sistema AntiNuke')
    .addSubcommand(s => s.setName('toggle').setDescription('Activa/desactiva el AntiNuke'))
    .addSubcommand(s => s.setName('config').setDescription('Configura los límites')
      .addIntegerOption(o => o.setName('maxbans').setDescription('Máximo de bans').setMinValue(1).setMaxValue(20))
      .addIntegerOption(o => o.setName('maxkicks').setDescription('Máximo de kicks').setMinValue(1).setMaxValue(20))
      .addIntegerOption(o => o.setName('maxcanales').setDescription('Máximo de canales eliminados').setMinValue(1).setMaxValue(10))
      .addIntegerOption(o => o.setName('maxroles').setDescription('Máximo de roles eliminados').setMinValue(1).setMaxValue(10))
      .addIntegerOption(o => o.setName('intervalo').setDescription('Intervalo en ms').setMinValue(3000).setMaxValue(60000)))
    .addSubcommand(s => s.setName('whitelist-add').setDescription('Añade usuario a whitelist').addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)))
    .addSubcommand(s => s.setName('whitelist-remove').setDescription('Quita usuario de whitelist').addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true)))
    .addSubcommand(s => s.setName('status').setDescription('Ver estado del AntiNuke'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  cooldown: 5,
  async execute(interaction) {
    let settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    if (!settings) settings = await GuildSettings.create({ guildId: interaction.guild.id });

    const sub = interaction.options.getSubcommand();

    if (sub === 'toggle') {
      settings.antiNuke.enabled = !settings.antiNuke.enabled;
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`AntiNuke ${settings.antiNuke.enabled ? '**activado** ✅' : '**desactivado** ❌'}.`)] });
    }

    if (sub === 'config') {
      const fields = ['maxbans', 'maxkicks', 'maxcanales', 'maxroles', 'intervalo'];
      const keys = ['maxBans', 'maxKicks', 'maxChannelDeletes', 'maxRoleDeletes', 'interval'];
      fields.forEach((f, i) => {
        const val = interaction.options.getInteger(f);
        if (val) settings.antiNuke[keys[i]] = val;
      });
      await settings.save();
      return interaction.reply({ embeds: [successEmbed('Configuración de AntiNuke actualizada.')] });
    }

    if (sub === 'whitelist-add') {
      const user = interaction.options.getUser('usuario');
      if (!settings.antiNuke.whitelist.includes(user.id)) {
        settings.antiNuke.whitelist.push(user.id);
        await settings.save();
      }
      return interaction.reply({ embeds: [successEmbed(`**${user.tag}** añadido a la whitelist de AntiNuke.`)] });
    }

    if (sub === 'whitelist-remove') {
      const user = interaction.options.getUser('usuario');
      settings.antiNuke.whitelist = settings.antiNuke.whitelist.filter(id => id !== user.id);
      await settings.save();
      return interaction.reply({ embeds: [successEmbed(`**${user.tag}** quitado de la whitelist de AntiNuke.`)] });
    }

    if (sub === 'status') {
      const an = settings.antiNuke;
      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setTitle('🔐 Estado del AntiNuke')
        .addFields(
          { name: 'Estado', value: an.enabled ? '✅ Activado' : '❌ Desactivado', inline: true },
          { name: 'Máx Bans', value: `${an.maxBans}`, inline: true },
          { name: 'Máx Kicks', value: `${an.maxKicks}`, inline: true },
          { name: 'Máx Canales borrados', value: `${an.maxChannelDeletes}`, inline: true },
          { name: 'Máx Roles borrados', value: `${an.maxRoleDeletes}`, inline: true },
          { name: 'Intervalo', value: `${an.interval}ms`, inline: true },
          { name: 'Whitelist', value: an.whitelist.length ? an.whitelist.map(id => `<@${id}>`).join(', ') : 'Ninguno' },
        );
      return interaction.reply({ embeds: [embed] });
    }
  },
};
