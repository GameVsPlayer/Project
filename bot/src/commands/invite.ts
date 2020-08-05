import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    const inviteEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setTitle("Invite Link")
        .setDescription(`If you want to invite the bot click **[here](https://discordapp.com/oauth2/authorize?client_id=${message.guild.me.id}&permissions=271607878&scope=bot)**`)
        .setColor(bot.config.color);

    message.channel.send(inviteEmbed).catch();
}
module.exports.help = {
    name: "invite"
}