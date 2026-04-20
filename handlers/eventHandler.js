const { readdirSync } = require('fs');
const { join } = require('path');

async function loadEvents(client) {
  const files = readdirSync(join(__dirname, '../events')).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const event = require(join(__dirname, '../events', file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`📡 Evento cargado: ${event.name}`);
  }
}

module.exports = { loadEvents };
