const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();

const config = require('./config.json');
const token = config.token || process.env.DISCORD_TOKEN;
const clientId = config.clientId || process.env.CLIENT_ID;
const guildId = config.guildId || process.env.GUILD_ID;

const commands = [];
const categories = readdirSync(join(__dirname, 'commands'));

for (const category of categories) {
  const files = readdirSync(join(__dirname, 'commands', category)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(join(__dirname, 'commands', category, file));
    if (command?.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`🔄 Registrando ${commands.length} comandos slash...`);

    // Guild deploy (instantáneo, para pruebas)
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log(`✅ Comandos registrados en el servidor (guild) correctamente.`);
    } else {
      // Global deploy (tarda hasta 1 hora)
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log(`✅ Comandos registrados globalmente.`);
    }
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();
