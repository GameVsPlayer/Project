const Discord = require("discord.js");

const moment = require("moment-timezone");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let sicon = message.guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

    var time = moment(message.guild.createdAt)

    let serverembed = new Discord.MessageEmbed()
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