import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";

import moment from "moment-timezone";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let sicon: string = message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

    var time = moment(message.guild.createdAt)

    let serverembed: MessageEmbed = new Discord.MessageEmbed()
        .setTitle("**Server Information**")
        .setColor(bot.config.color)
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name, true)
        .addField("Created at", `${moment(time).format("DD/MM/YYYY hh:mm:ss")}`, true)
        .addField("Server Region", message.guild.region, true)
        .addField("Total Members", message.guild.memberCount, true)
        .addField("Server Owner", `<@${message.guild.ownerID}>`, true);

    return message.channel.send(serverembed).catch();
}
module.exports.help = {
    name: "serverinfo",
    alias: "si"
}