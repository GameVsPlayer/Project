import { Message, MessageEmbed } from "discord.js";

const Discord = require("discord.js");

const translate = require("@vitalets/google-translate-api");


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    let originalLang: string, toTranslateTo: string;
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");
    if (!args[0]) return message.channel.send("Please specify the the language you want to translate available languages are listed here https://gamu.tk/langs");
    else originalLang = args[0].toLowerCase();
    if (!args[1]) return message.channel.send("Please specify the language you want to translate to available languages are listed here https://gamu.tk/langs");
    else toTranslateTo = args[1].toLowerCase();
    if (args[0] == args[1]) return message.channel.send("You can\'t translate into the same language");
    if (!args[2]) return message.channel.send("Please specify a text");

    let text = args.slice(2).join(" ");

    translate(text, {
        from: originalLang,
        to: toTranslateTo
    }).then((res: any) => {

        let embed: MessageEmbed = new Discord.MessageEmbed()
            .setColor(bot.config.color)
            .setTitle("Translation")
            .addField("Initial language", originalLang, true)
            .addField("Translated language", toTranslateTo, true)
            .addField("Original text", text)
            .addField("Translation", res.text);

        message.channel.send(embed).catch();
    }).catch((err: Error) => {
        return message.channel.send(`Something went wrong ${err}`);
    });
}
module.exports.help = {
    name: "translate"
}