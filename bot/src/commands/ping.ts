import { Message } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    const m = await message.channel.send("Ping?").catch();
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`).catch();
}

module.exports.help = {
    name: "ping"
}