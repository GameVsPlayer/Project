const Discord = require("discord.js")


module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    embed = new Discord.MessageEmbed()

        .setTitle("Help")
        .setDescription("If you need help with commands and see which are available go to https://gamu.tk/commands");

    message.channel.send(embed)

}
module.exports.help = {
    name: "help"
}