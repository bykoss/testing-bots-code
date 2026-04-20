const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Muestra información de un rol')
    .addRoleOption(o => o.setName('rol').setDescription('Rol').setRequired(true)),
  cooldown: 5,
  async execute(interaction) {
    const role = interaction.options.getRole('rol');
    const members = interaction.guild.members.cache.filter(m => m.roles.cache.has(role.id)).size;

    const embed = new EmbedBuilder()
      .setColor(role.hexColor)
      .setTitle(`🎭 ${role.name}`)
      .addFields(
        { name: '🆔 ID', value: role.id, inline: true },
        { name: '🎨 Color', value: role.hexColor, inline: true },
        { name: '👥 Miembros', value: `${members}`, inline: true },
        { name: '📅 Creado', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '📌 Posición', value: `${role.rawPosition}`, inline: true },
        { name: '🔔 Mencionable', value: role.mentionable ? 'Sí' : 'No', inline: true },
        { name: '📢 Separado', value: role.hoist ? 'Sí' : 'No', inline: true },
        { name: '🤖 Gestionado', value: role.managed ? 'Sí' : 'No', inline: true },
      );
    interaction.reply({ embeds: [embed] });
  },
};
