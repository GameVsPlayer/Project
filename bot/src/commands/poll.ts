import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";
const errors = require("../utils/errors.js");

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms("MANAGE_MESSAGES").catch();

    if (!message.guild.me.hasPermission("ADD_REACTIONS")) return message.reply("I do not have the 'ADD REACTION' permission")

    if (!args[0]) return message.channel.send("Proper Usage: <prefix>poll question").catch();

    const embed: MessageEmbed = new Discord.MessageEmbed()
        .setColor(0xffffff)
        .setFooter("React to vote.")
        .setDescription(args.join(' '))
        .setTitle(`Poll created by ${message.author.username}`);

    let msg = await message.channel.send(embed).catch();

    await msg.react('✅').catch();
    await msg.react('⛔').catch();

    message.delete({
        timeout: 1000
    }).catch();
}
module.exports.help = {
    name: "poll"
}