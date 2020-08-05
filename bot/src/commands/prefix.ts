import { MessageEmbed, Message } from "discord.js";

import Discord from "discord.js";
const errors = require("../utils/errors.js");

module.exports.run = async (bot: any, message: Message, args: string[]) => {


    if (!message.member.hasPermission("MANAGE_GUILD")) return errors.noPerms(message, "MANAGE_GUILD").catch();
    let prefix;
    await new Promise(function (resolve, reject) {
        bot.extra.getPrefix(bot, message.guild, function (prefixCB: string) {
            prefix = prefixCB;
            resolve();
        });
    });

    if (!args[0] || args[0] === "help") return message.reply(`Usage: ${prefix}prefix <The prefix you want to set for the server>`).catch();

    await bot.extra.setPrefix(bot, message.guild, args[0], function (prefixCB: string) {
    });

    let Embed: MessageEmbed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle("Prefix changed!")
        .setDescription(`Set from ${prefix} to ${args[0]}`);

    message.channel.send(Embed).catch();

}

module.exports.help = {
    name: "prefix"
}