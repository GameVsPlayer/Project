import { MessageEmbed, Permissions, Message } from "discord.js";

const Discord = require("discord.js");

module.exports.noPerms = (message: any, perm: Permissions, bot: any) => {
    let embed: MessageEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username)
        .setTitle("No PERMS")
        .setColor(bot.config.color)
        .addField("Insufficent permission", perm);

    message.channel.send(embed)((m: Message) => m.delete({ timeout: 5000 }));
}
