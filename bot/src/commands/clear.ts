import { Message, MessageCollector, Channel } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send("I do not have the 'MANAGE_MESSAGES' permission")
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You dont have the permission to use this command!").catch();
    if (!args[0]) return message.channel.send("usage <prefix>clear <amount of messages to delete>").catch();
    if (Number.isNaN(args[0])) return message.reply("That is not a number!").catch();
    var clearNumber = Math.floor(parseInt(args[0]));
    if (100 < clearNumber) return message.reply("Please choose a number between 1 and 100").catch();
    message.delete({ timeout: 0 });

    const fetched: any = await message.channel.messages.fetch({
        limit: clearNumber
    }).catch();
    if (fetched.size <= 1) return;

    message.channel.bulkDelete(fetched)
        .catch((error) => message.channel.send(`Error: ${error}`));
    message.channel.send(`${fetched.size} messages deleted!`).catch();
}

module.exports.help = {
    name: "clear"
}