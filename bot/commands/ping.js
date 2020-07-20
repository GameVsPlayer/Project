const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const m = await message.channel.send("Ping?").catch();
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`).catch();
}

module.exports.help = {
    name: "ping"
}