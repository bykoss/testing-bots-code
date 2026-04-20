const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Obtén el link de invitación del bot'),
  cooldown: 5,
  async execute(interaction, client) {
    const invite = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;
    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle('📩 Invitar al Bot')
      .setDescription(`[Haz clic aquí para invitarme](${invite})`)
      .setThumbnail(client.user.displayAvatarURL());
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
