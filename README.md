# 🤖 Discord Bot — discord.js v14

Bot completo para Discord con más de **80 comandos slash** organizados en categorías, sistema AntiNuke, AntiRaid, moderación completa, economía, roleplay y más.

---

## 📁 Estructura del proyecto

```
discord-bot/
├── commands/
│   ├── admin/          # eval, servers, say, setstatus
│   ├── antiraid/       # antiraid
│   ├── antinuke/       # antinuke
│   ├── channels/       # channel-create, delete, rename, clone, topic, info, nsfw
│   ├── community/      # rep, profile, bio, suggest, daily, balance, pay, leaderboard, work, giveaway
│   ├── config/         # config
│   ├── games/          # rps
│   ├── general/        # help, ping, serverinfo, userinfo, avatar, botinfo, roleinfo, invite
│   ├── moderation/     # ban, unban, kick, mute, unmute, warn, warns, clearwarns, purge, softban, slowmode, lock, unlock, nick, role-add, role-remove, cases, announce
│   ├── roleplay/       # hug, kiss, slap, pat, cry, dance, poke, bite, cuddle, wave, smile, highfive, feed, tickle, punch, blush
│   └── utility/        # poll, embed, reminder, calc, coinflip, dice, 8ball, choose, translate, weather, ticket
├── events/
│   ├── ready.js
│   ├── interactionCreate.js
│   ├── guildMemberAdd.js
│   ├── guildMemberRemove.js
│   ├── antiNuke.js
│   └── ticketButton.js
├── handlers/
│   ├── commandHandler.js
│   └── eventHandler.js
├── models/
│   ├── GuildSettings.js
│   ├── User.js
│   └── Case.js
├── utils/
│   ├── database.js
│   ├── embeds.js
│   ├── logger.js
│   └── permissions.js
├── config.json
├── deploy-commands.js
├── index.js
├── package.json
├── railway.json
├── Procfile
└── .env.example
```

---

## 🚀 Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd discord-bot
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```env
DISCORD_TOKEN=tu_token_aqui
CLIENT_ID=id_de_tu_bot
GUILD_ID=id_de_tu_servidor_de_prueba
MONGO_URI=mongodb+srv://usuario:pass@cluster.mongodb.net/botdb
LOG_CHANNEL=id_canal_de_logs
WEATHER_API_KEY=api_key_openweathermap
```

> También puedes poner los valores directamente en `config.json`.

### 3. Registrar los comandos slash
```bash
node deploy-commands.js
```

### 4. Iniciar el bot
```bash
node index.js
# o en desarrollo:
npm run dev
```

---

## ☁️ Deploy en Railway (24/7)

1. Sube el código a un repositorio de GitHub
2. Ve a [railway.app](https://railway.app) y crea un nuevo proyecto
3. Selecciona **"Deploy from GitHub repo"** y elige tu repositorio
4. En la pestaña **Variables**, agrega:

| Variable | Valor |
|---|---|
| `DISCORD_TOKEN` | Token de tu bot |
| `CLIENT_ID` | ID de tu aplicación |
| `GUILD_ID` | ID de tu servidor (opcional, para deploy de guild) |
| `MONGO_URI` | URI de MongoDB Atlas |
| `LOG_CHANNEL` | ID del canal de logs |

5. Railway detectará el `Procfile` y ejecutará `node index.js` automáticamente
6. Ejecuta `node deploy-commands.js` una vez desde local para registrar los slash commands

---

## 🗄️ MongoDB Atlas (gratis)

1. Ve a [mongodb.com/atlas](https://mongodb.com/atlas)
2. Crea una cuenta gratuita y un cluster Shared (M0 gratis)
3. En **Database Access**, crea un usuario con contraseña
4. En **Network Access**, permite `0.0.0.0/0`
5. Copia la URI de conexión y ponla en `MONGO_URI`

---

## ⚙️ config.json

```json
{
  "token": "",           // Token del bot (o usar .env)
  "clientId": "",        // ID de la aplicación
  "guildId": "",         // ID del servidor (solo para guild commands)
  "mongoURI": "",        // URI de MongoDB (o usar .env)
  "prefix": "!",
  "embedColor": "#5865F2",
  "ownerIds": ["TU_ID_AQUI"],
  "logChannel": "",
  "antiNuke": {
    "enabled": true,
    "maxBans": 5,
    "maxKicks": 5,
    "maxChannelDeletes": 3,
    "maxRoleDeletes": 3,
    "interval": 10000
  },
  "antiRaid": {
    "enabled": true,
    "joinThreshold": 10,
    "joinInterval": 5000,
    "action": "kick"
  }
}
```

---

## 🛡️ Sistemas de protección

### AntiNuke
Detecta y banea automáticamente a quien:
- Banee demasiados usuarios en poco tiempo
- Kickee demasiados usuarios en poco tiempo  
- Elimine demasiados canales
- Elimine demasiados roles

Configurable con `/antinuke config` y whitelist con `/antinuke whitelist-add`.

### AntiRaid
Detecta floods de joins y kickea/banea automáticamente a los que entran en masa.

Configurable con `/antiraid config`.

---

## 📋 Comandos disponibles

| Categoría | Comandos |
|---|---|
| 🔨 Moderación | ban, unban, kick, mute, unmute, warn, warns, clearwarns, purge, softban, slowmode, lock, unlock, nick, role-add, role-remove, cases, announce |
| 📁 Canales | channel-create, channel-delete, channel-rename, channel-clone, channel-topic, channel-info, channel-nsfw |
| 🔐 AntiNuke | antinuke (toggle, config, whitelist-add, whitelist-remove, status) |
| 🛡️ AntiRaid | antiraid (toggle, config, status) |
| ⚙️ Config | config (welcome, leave, logs, autorole, muterole, view) |
| 🌐 General | help, ping, serverinfo, userinfo, avatar, botinfo, roleinfo, invite |
| 🔧 Utilidades | poll, embed, reminder, calc, coinflip, dice, 8ball, choose, translate, weather, ticket |
| 👥 Comunidad | rep, profile, bio, suggest, daily, balance, pay, leaderboard, work, giveaway |
| 🎭 Roleplay | hug, kiss, slap, pat, cry, dance, poke, bite, cuddle, wave, smile, highfive, feed, tickle, punch, blush |
| 🎮 Juegos | rps |
| 👑 Admin | eval, servers, say, setstatus |

---

## 📦 Dependencias principales

- `discord.js` v14
- `mongoose` — Base de datos MongoDB
- `ms` — Parseo de tiempo
- `axios` — Peticiones HTTP (clima, traducciones, gifs)
- `@discordjs/voice` — Sistema de voz

---

## 📝 Licencia

MIT — Libre para usar y modificar.
