const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { isOwner } = require('../../utils/permissions');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('[OWNER] Ejecuta código JavaScript')
    .addStringOption(o => o.setName('codigo').setDescription('Código a ejecutar').setRequired(true)),
  cooldown: 3,
  async execute(interaction) {
    if (!isOwner(interaction.user.id))
      return interaction.reply({ content: '❌ Solo el dueño puede usar este comando.', ephemeral: true });

    const code = interaction.options.getString('codigo');
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      if (typeof result !== 'string') result = require('util').inspect(result, { depth: 1 });
      if (result.length > 1900) result = result.slice(0, 1900) + '...';
      interaction.reply({ content: codeBlock('js', result), ephemeral: true });
    } catch (err) {
      interaction.reply({ content: codeBlock('js', err.toString()), ephemeral: true });
    }
  },
};
