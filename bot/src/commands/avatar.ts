import { Message, MessageEmbed, User } from "discord.js";

import Discord from "discord.js";

const shortUrl = require('tinyurl');


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");

    let memberA: User = await bot.extra.autocomplete(message, args);
    let avatarURL = memberA.avatarURL({ format: 'png', dynamic: true, size: 2048 });
    let avatarURLSmall = memberA.avatarURL({ format: 'png', dynamic: true, size: 128 });
    if (!avatarURL) return message.channel.send("This users doesn\'t have a Avatar!");

    shortUrl.shorten(`${avatarURL}`, function (avatarLink: string, err: Error) {

        let embed: MessageEmbed = new Discord.MessageEmbed()
            .addField("Avatar", `${memberA}`)

            .setImage(`${avatarURLSmall}`)

            .setDescription(`**LINK** ${avatarLink}`)

        message.channel.send(embed).catch((err) => bot.logger.error(err));
    });
}
module.exports.help = {
    name: "avatar",
    alias: "av"
}