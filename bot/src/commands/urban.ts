import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";
const superagent = require("superagent");


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (args.length < 1) return message.channel.send("Please enter something.");
    let searchTerm: string = args.join(" ");

    let url: string = `http://api.urbandictionary.com/v0/define?term=${searchTerm}`
    let {
        body
    } = await superagent
        .get(url).catch()

    if (!body.list[0]) return message.reply("That word could not be found!").catch();
    let bodyConverted: any = body.list[Math.floor(Math.random() * body.list.length)];



    let embed: MessageEmbed = new Discord.MessageEmbed()
        .setTitle(bodyConverted.word)
        .addField("Defenition", bodyConverted.definition)
        .addField("Upvotes 👍", bodyConverted.thumbs_up, true)
        .addField("Downvotes 👎", bodyConverted.thumbs_down, true)
        .addField("example", bodyConverted.example)
        .setURL(bodyConverted.permalink)
        .setColor(bot.config.color);

    message.channel.send(embed).catch();

};



module.exports.help = {
    name: "urban"
}