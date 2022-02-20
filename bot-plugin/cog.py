import discord, asyncio
from discord.ext import commands
import json, random, subprocess, string, launcher # Get launcher to utilise its safe_import functionality to ensure the needed installs are present.
from datetime import datetime
from utils.models.plugin import Plugin


class WebDev(Plugin):
    def __init__(self, bot):
        self.bot = bot


def setup(bot):

    from plugins.webdev.api import routes
    bot.data["api_routes"].append(["webdev", routes])

    bot.add_cog(WebDev(bot))