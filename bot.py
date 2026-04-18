import discord
import json
import os
import asyncio
import random
import string
import time
from datetime import datetime, timedelta
from discord.ext import commands, tasks
from discord import app_errors
from dotenv import load_dotenv

# --- CONFIGURACIÓN INICIAL ---
load_dotenv()
TOKEN = os.getenv("MTAxMTQ1NDk3NzMxNjc2MTcxMA.GpnxEx.ccBWew_bbDi--I-U9k05-5AJNeO-RZsgXl4srM")

# Cargar configuración desde un archivo JSON
try:
    with open('config.json', 'r') as f:
        config = json.load(f)
except FileNotFoundError:
    # Crear un config.json por defecto si no existe
    config = {
        "prefix": "!",
        "owner_id": "893295635837644810",
        "guild_id": "1478566077041741866",
        "embed_color": "2F3136",
        "error_color": "ED4245",
        "success_color": "57F287"
    }
    with open('config.json', 'w') as f:
        json.dump(config, f, indent=4)
    print("Se ha creado un archivo 'config.json'. Por favor, edítalo con tus IDs.")

# --- INTENTS Y BOT ---
intents = discord.Intents.default()
intents.guilds = True
intents.members = True
intents.bans = True
intents.messages = True
intents.message_content = True
intents.reactions = True
intents.voice_states = True

bot = commands.Bot(command_prefix=config['prefix'], intents=intents, owner_ids={int(config['893295635837644810'])})

# --- ALMACENAMIENTO EN MEMORIA ---
warns = {}
muted_users = {}
tempbans = {}
economy_data = {}
levels_data = {}
snipe_message = {}
editsnipe_message = {}
raid_mode = {}
antinuke_config = {}
welcome_messages = {}
leave_messages = {}

# --- FUNCIONES AUXILIARES ---
def get_embed(title="", description="", color=None, footer=None):
    """Crea un embed con el estilo del bot."""
    color_val = int(color, 16) if color else int(config['embed_color'], 16)
    embed = discord.Embed(title=title, description=description, color=color_val)
    if footer:
        embed.set_footer(text=footer)
    return embed

async def is_owner(ctx):
    """Verifica si el usuario es el dueño del bot."""
    return ctx.author.id == bot.owner_ids

# === COMANDOS DE MODERACIÓN ===
@bot.command(name='kick')
@commands.has_permissions(kick_members=True)
async def kick(ctx, member: discord.Member, *, reason="No especificada."):
    if member.top_role >= ctx.author.top_role and ctx.author.id != ctx.guild.owner_id:
        return await ctx.send(embed=get_embed("❌ Error", "No puedes expulsar a alguien con un rol igual o superior al tuyo.", config['error_color']))
    await member.kick(reason=reason)
    await ctx.send(embed=get_embed("🔨 Usuario Expulsado", f"{member.mention} ha sido expulsado.\n**Razón:** {reason}", config['success_color']))

@bot.command(name='ban')
@commands.has_permissions(ban_members=True)
async def ban(ctx, member: discord.Member, *, reason="No especificada."):
    if member.top_role >= ctx.author.top_role and ctx.author.id != ctx.guild.owner_id:
        return await ctx.send(embed=get_embed("❌ Error", "No puedes banear a alguien con un rol igual o superior al tuyo.", config['error_color']))
    await member.ban(reason=reason)
    await ctx.send(embed=get_embed("⛔ Usuario Baneado", f"{member.mention} ha sido baneado.\n**Razón:** {reason}", config['success_color']))

@bot.command(name='unban')
@commands.has_permissions(ban_members=True)
async def unban(ctx, user_id: int, *, reason="No especificada."):
    user = await bot.fetch_user(user_id)
    await ctx.guild.unban(user, reason=reason)
    await ctx.send(embed=get_embed("✅ Usuario Desbaneado", f"{user.mention} ha sido desbaneado.\n**Razón:** {reason}", config['success_color']))

@bot.command(name='clear')
@commands.has_permissions(manage_messages=True)
async def clear(ctx, amount: int = 10):
    if amount <= 0 or amount > 100: return await ctx.send(embed=get_embed("❌ Error", "La cantidad debe estar entre 1 y 100.", config['error_color']))
    deleted = await ctx.channel.purge(limit=amount + 1)
    await ctx.send(embed=get_embed("🧹 Mensajes Eliminados", f"Se eliminaron `{len(deleted) - 1}` mensajes.", config['success_color']), delete_after=5)

@bot.command(name='mute')
@commands.has_permissions(manage_roles=True)
async def mute(ctx, member: discord.Member, *, reason="No especificada."):
    muted_role = discord.utils.get(ctx.guild.roles, name="Muted")
    if not muted_role: return await ctx.send(embed=get_embed("❌ Error", "No se encontró el rol 'Muted'. Por favor, créalo.", config['error_color']))
    if muted_role in member.roles: return await ctx.send(embed=get_embed("❌ Error", "Este miembro ya está silenciado.", config['error_color']))
    await member.add_roles(muted_role, reason=reason)
    await ctx.send(embed=get_embed("🔇 Usuario Silenciado", f"{member.mention} ha sido silenciado.\n**Razón:** {reason}", config['success_color']))

@bot.command(name='unmute')
@commands.has_permissions(manage_roles=True)
async def unmute(ctx, member: discord.Member, *, reason="No especificada."):
    muted_role = discord.utils.get(ctx.guild.roles, name="Muted")
    if not muted_role or muted_role not in member.roles: return await ctx.send(embed=get_embed("❌ Error", "Este miembro no está silenciado.", config['error_color']))
    await member.remove_roles(muted_role, reason=reason)
    await ctx.send(embed=get_embed("🔈 Usuario Desilenciado", f"{member.mention} ha sido desilenciado.\n**Razón:** {reason}", config['success_color']))

@bot.command(name='tempmute')
@commands.has_permissions(manage_roles=True)
async def tempmute(ctx, member: discord.Member, duration: str, *, reason="No especificada."):
    muted_role = discord.utils.get(ctx.guild.roles, name="Muted")
    if not muted_role: return await ctx.send(embed=get_embed("❌ Error", "No se encontró el rol 'Muted'.", config['error_color']))
    if muted_role in member.roles: return await ctx.send(embed=get_embed("❌ Error", "Este miembro ya está silenciado.", config['error_color']))
    
    # Convertir duración (ej: 10m, 1h, 1d) a segundos
    time_unit = duration[-1]
    time_value = int(duration[:-1])
    if time_unit == 's': seconds = time_value
    elif time_unit == 'm': seconds = time_value * 60
    elif time_unit == 'h': seconds = time_value * 3600
    elif time_unit == 'd': seconds = time_value * 86400
    else: return await ctx.send(embed=get_embed("❌ Error", "Unidad de tiempo no válida. Usa s, m,
