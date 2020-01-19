const Discord = require("discord.js");

const moment = require("moment-timezone");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) {
        return message.channel.send("I dont have the permission to send embeds");
    }
    var time = moment(bot.user.createdAt)
    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
        .setTitle("**Bot Information**")
        .setColor(bot.config.color)
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username, true)
        .addField("Created on", `${moment(time).format("DD/MM/YYYY hh:mm:ss")}`, true)
        .addField("Server count", `${bot.guilds.size}`, true)
        .addField("User count", `${bot.users.size}`, true)
        .addField("User Messages", bot.stats.userMessages, true)
        .addField("Commands used", bot.stats.botCommands, true)
        .addField("Uptime", bot.fullUptime, true)
        .addField("Version", bot.version, true)
        .addField("Latest Changes", `[info](https://gamu.tk/commands)`, true)
        .addField("RAM usage", bot.usage, true)

    return message.channel.send(botembed).catch();
}
module.exports.help = {
    name: "botinfo",
    alias: "bi"
}