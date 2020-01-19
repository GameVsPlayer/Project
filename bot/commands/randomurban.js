const Discord = require("discord.js");
const urban = require("urban");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    urban.random().first((json) => {

        let embed = new Discord.RichEmbed()
            .setTitle(json.word || "None")
            .addField("Defenition", json.definition || "None")
            .addField("Upvotes", json.thumbs_up, true || "None")
            .addField("Downvotes", json.thumbs_down, true || "None")
            .setURL(json.permalink || "None")
            .setFooter(`Written by ${json.author || "None"}`);

        message.channel.send(embed).catch();
    });

}

module.exports.help = {
    name: "randomurban",
    alias: "randur"
}