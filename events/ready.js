const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(`\n✅ Bot conectado como: ${client.user.tag}`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);

    const activities = [
      { name: `${client.guilds.cache.size} servidores`, type: ActivityType.Watching },
      { name: '/help para ayuda', type: ActivityType.Playing },
      { name: `${client.users.cache.size} usuarios`, type: ActivityType.Watching },
    ];

    let i = 0;
    client.user.setActivity(activities[0].name, { type: activities[0].type });

    setInterval(() => {
      i = (i + 1) % activities.length;
      client.user.setActivity(activities[i].name, { type: activities[i].type });
    }, 15000);
  },
};
