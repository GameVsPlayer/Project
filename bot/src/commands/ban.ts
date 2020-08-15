import {
    Message,
    TextChannel,
    MessageEmbed,
    GuildMember
} from "discord.js";

import Discord from "discord.js";
const errors = require("../utils/errors.js");

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let bUser: GuildMember = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if (!bUser) return message.channel.send("Can't find user!").catch();
    let bReason = args.join(" ").slice(22);
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I do not have the permission to perform that action!")
    if (!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS").catch();
    if (bUser.hasPermission("BAN_MEMBERS")) {
        try {
            return message.channel.send("That Person can't be banned!")
                .then((message) => {
                    message.delete({
                        timeout: 5000
                    }).catch();
                });
        } catch { }
    };
    if (!bReason) bReason = "no reason specified"
    let banEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setDescription("Ban")
        .setColor(bot.config.color)
        .addField("Banned User", `${bUser} with ID ${bUser.id}`)
        .addField("Banned by", `<@${message.author.id}> with ID ${message.author.id}}`)
        .addField("Banned in", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", bReason);

    let id: any = message.guild.channels.cache.map((channel: TextChannel) => {
        channel.name === "reports";
        return channel.id
    });
    let banChannel: TextChannel = await bot.channels.fetch(id);
    if (!banChannel) {
        try {
            return message.channel.send("Can't find Reports Channel.")
                .then((message) => {
                    message.delete({
                        timeout: 5000
                    }).catch();
                });
        } catch { }
    };
    message.guild.member(bUser).ban({
        reason: bReason
    }).catch();

    banChannel.send(banEmbed).catch();
}
module.exports.help = {
    name: "ban"
}