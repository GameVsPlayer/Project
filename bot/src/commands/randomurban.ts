import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";
const urban = require("urban");

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    urban.random().first((json: any) => {

        let embed: MessageEmbed = new Discord.MessageEmbed()
            .setTitle(json.word || "None")
            .addField("Defenition", json.definition)
            .addField("Upvotes", json.thumbs_up, true)
            .addField("Downvotes", json.thumbs_down, true)
            .setURL(json.permalink || "None")
            .setFooter(`Written by ${json.author}`)
            .setColor(bot.config.color)
        message.channel.send(embed).catch();
    });

}

module.exports.help = {
    name: "randomurban",
    alias: "randur"
}