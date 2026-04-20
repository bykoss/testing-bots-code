const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role-add')
    .setDescription('Añade un rol a un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addRoleOption(o => o.setName('rol').setDescription('Rol a añadir').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  cooldown: 3,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    const role = interaction.options.getRole('rol');
    if (!target) return interaction.reply({ embeds: [errorEmbed('Usuario no encontrado.')], ephemeral: true });
    if (role.position >= interaction.guild.members.me.roles.highest.position)
      return interaction.reply({ embeds: [errorEmbed('No puedo asignar ese rol.')], ephemeral: true });
    if (target.roles.cache.has(role.id))
      return interaction.reply({ embeds: [errorEmbed('El usuario ya tiene ese rol.')], ephemeral: true });
    await target.roles.add(role);
    interaction.reply({ embeds: [successEmbed(`Se asignó el rol ${role} a **${target.user.tag}**.`)] });
  },
};
