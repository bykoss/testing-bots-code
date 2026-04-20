const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar de un usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario')),
  cooldown: 5,
  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;
    const formats = ['png', 'jpg', 'webp', 'gif'];
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new EmbedBuilder()
      .setColor(config.embedColor)
      .setTitle(`🖼️ Avatar de ${user.tag}`)
      .setImage(avatarURL)
      .setDescription(formats.map(f => `[${f.toUpperCase()}](${user.displayAvatarURL({ format: f, size: 4096 })})`).join(' • '));

    interaction.reply({ embeds: [embed] });
  },
};
