import moment = require("moment-timezone")
import { Message } from "discord.js";
module.exports.run = async (bot: any, message: Message, args: string[]) => {
    bot.user.setActivity(`The Time: ${moment().tz("Europe/Berlin").format("H:mm")} CEST`, {
        type: "WATCHING"
    }).catch((err: Error) => bot.logger.error(err));
    return;
}
module.exports.activity = {
    name: 3
}