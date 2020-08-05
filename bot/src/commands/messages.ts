import { Message } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    let xp: any = await bot.db.xpDB.findOne({
        userid: message.author.id
    });
    message.channel.send('Messages send: `' + xp.messageCount + '`\nLevel: `' + (xp.level) + '`').catch();
}
module.exports.help = {
    name: "messages",
    alias: "msgs"
}