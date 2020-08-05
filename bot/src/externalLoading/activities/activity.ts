import { Message } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    bot.user.setActivity(`on ${bot.guilds.cache.size} Servers`, {
        type: "PLAYING"
    }).catch((err: Error) => bot.logger.error(err));
    return;
}

module.exports.activity = {
    name: 1
};