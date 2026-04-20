const { SlashCommandBuilder } = require('discord.js');
const { successEmbed } = require('../../utils/embeds');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bio')
    .setDescription('Establece tu biografía')
    .addStringOption(o => o.setName('texto').setDescription('Tu bio (vacío para borrarla)').setMaxLength(200)),
  cooldown: 10,
  async execute(interaction) {
    const texto = interaction.options.getString('texto') || '';
    await User.findOneAndUpdate(
      { userId: interaction.user.id, guildId: interaction.guild.id },
      { bio: texto },
      { upsert: true }
    );
    interaction.reply({ embeds: [successEmbed(texto ? `Biografía actualizada: *${texto}*` : 'Biografía eliminada.')], ephemeral: true });
  },
};
