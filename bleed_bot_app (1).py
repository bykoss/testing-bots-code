import os
from bot import run_bot

# Railway inyectará el token como variable de entorno
TOKEN = os.getenv("DISCORD_TOKEN")

if not TOKEN:
    print("ERROR: La variable de entorno DISCORD_TOKEN no está configurada.")
else:
    run_bot(TOKEN)