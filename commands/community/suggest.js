const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { errorEmbed } = require('../../utils/embeds');
const GuildSettings = require('../../models/GuildSettings');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Envía una sugerencia al servidor')
    .addStringOption(o => o.setName('sugerencia').setDescription('Tu sugerencia').setRequired(true).setMaxLength(1000)),
  cooldown: 30,
  async execute(interaction) {
    const sugerencia = interaction.options.getString('sugerencia');
    const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
    const channelId = settings?.logChannel;
    const channel = channelId ? interaction.guild.channels.cache.get(channelId) : null;

    if (!channel) return interaction.reply({ embeds: [errorEmbed('No hay un canal de sugerencias configurado.')], ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('💡 Nueva Sugerencia')
      .setDescription(sugerencia)
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setFooter({ text: `ID: ${interaction.user.id}` })
      .setTimestamp();

    const msg = await channel.send({ embeds: [embed] });
    await msg.react('✅');
    await msg.react('❌');

    interaction.reply({ content: '✅ Sugerencia enviada.', ephemeral: true });
  },
};
