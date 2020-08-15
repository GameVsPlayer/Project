import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    const embed: MessageEmbed = new Discord.MessageEmbed()

        .setTitle("Help")
        .setColor(bot.config.color)
        .setDescription("If you need help with commands and see which are available go to https://gamu.tk/commands");

    message.channel.send(embed)

}
module.exports.help = {
    name: "help"
}