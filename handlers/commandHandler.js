const { readdirSync } = require('fs');
const { join } = require('path');

async function loadCommands(client) {
  const categories = readdirSync(join(__dirname, '../commands'));

  for (const category of categories) {
    const files = readdirSync(join(__dirname, '../commands', category)).filter(f => f.endsWith('.js'));
    for (const file of files) {
      const command = require(join(__dirname, '../commands', category, file));
      if (command?.data && command?.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Comando cargado: /${command.data.name}`);
      }
    }
  }

  console.log(`\n🚀 ${client.commands.size} comandos cargados en total.\n`);
}

module.exports = { loadCommands };
