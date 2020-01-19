const Discord = require("discord.js");
const superagent = require("superagent");


module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (args.length < 1) return message.channel.send("Please enter something.");
    let searchTerm = args.join(" ");

    usernameRequst = args[0].toString();
    var url = `http://api.urbandictionary.com/v0/define?term=${searchTerm}`
    let {
        body
    } = await superagent
        .get(url).catch()

    if (!body.list[0]) return message.reply("That word could not be found!").catch();
    var bodyConverted = body.list[Math.floor(Math.random() * body.list.length)];
    //= body.list[0];


    let embed = new Discord.RichEmbed()
        .setTitle(bodyConverted.word || "None")
        .addField("Defenition", bodyConverted.definition || "None")
        .addField("Upvotes 👍", bodyConverted.thumbs_up, true || "None")
        .addField("Downvotes 👎", bodyConverted.thumbs_down, true || "None")
        .addField("example", bodyConverted.example || "None")
        .setURL(bodyConverted.permalink || "None")
        .setColor(bot.config.color);

    message.channel.send(embed).catch();

};



module.exports.help = {
    name: "urban"
}