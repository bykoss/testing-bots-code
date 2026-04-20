const { SlashCommandBuilder } = require('discord.js');
const { successEmbed, errorEmbed } = require('../../utils/embeds');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfiere monedas a otro usuario')
    .addUserOption(o => o.setName('usuario').setDescription('Usuario').setRequired(true))
    .addIntegerOption(o => o.setName('cantidad').setDescription('Cantidad a transferir').setRequired(true).setMinValue(1)),
  cooldown: 5,
  async execute(interaction) {
    const target = interaction.options.getMember('usuario');
    const amount = interaction.options.getInteger('cantidad');

    if (!target || target.user.bot) return interaction.reply({ embeds: [errorEmbed('Usuario inválido.')], ephemeral: true });
    if (target.id === interaction.user.id) return interaction.reply({ embeds: [errorEmbed('No puedes pagarte a ti mismo.')], ephemeral: true });

    let sender = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (!sender) sender = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
    if (sender.balance < amount) return interaction.reply({ embeds: [errorEmbed('No tienes suficiente dinero.')], ephemeral: true });

    let receiver = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
    if (!receiver) receiver = await User.create({ userId: target.id, guildId: interaction.guild.id });

    sender.balance -= amount;
    receiver.balance += amount;
    await sender.save();
    await receiver.save();

    interaction.reply({ embeds: [successEmbed(`Transferiste **${amount} monedas** a **${target.user.tag}**.`)] });
  },
};
