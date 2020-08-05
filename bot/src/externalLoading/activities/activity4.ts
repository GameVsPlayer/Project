import { Message } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    bot.user.setActivity("Gamu.tk", {
        type: "WATCHING"
    }).catch((err: Error) => bot.logger.error(err));
    return;
}
module.exports.activity = {
    name: 4
}