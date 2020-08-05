import { Message } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: String[]) => {
    bot.user.setActivity(`with ${bot.users.cache.size - 1} Users`, {
        type: "PLAYING"
    }).catch((err: Error) => bot.logger.error(err));
    return;
}
module.exports.activity = {
    name: 2
}