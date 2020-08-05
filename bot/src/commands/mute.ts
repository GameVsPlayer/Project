import { Message, User, GuildMember, Role, GuildChannel } from "discord.js";

import fs from "fs";
const errors = require("../utils/errors.js");


module.exports.run = async (bot: any, message: Message, args: string[]) => {

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms("MANAGE_MESSAGES").catch();
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.reply("I do not have the permission to perform that action");
    const toMute: GuildMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!toMute) {
        return message.channel.send("You did not  specify a user").catch();
    }
    if (!args[1]) {
        return message.reply("No time specified!").catch();
    }
    if (isNaN(parseInt(args[1]))) {
        return message.reply("That is not a number!").catch();
    }
    var muteTime: number = Math.floor(parseInt(args[1]));
    if (toMute.id === message.author.id) {
        return message.channel.send("You can't mute yourself.").catch();
    }
    toMute.permissions
    if (toMute.permissions >= message.member.permissions) {
        return message.channel.send("You cannot mute a member who has a higher role than you.").catch();
    }

    let role: Role = message.guild.roles.cache.find((r) => r.name === "Karen Muted");
    if (!role) {
        try {
            role = await message.guild.roles.create({
                data: {
                    name: "Karen Muted",
                    color: "#000000",
                    permissions: []
                }
            }).catch();
            message.guild.channels.cache.forEach(async (channel: GuildChannel, id: string) => {
                await channel.createOverwrite(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            bot.logger.info(e.stack);
        }
    }

    if (toMute.roles.cache.has(role.id)) {
        return message.channel.send("This user is already muted!").catch();
    }
    bot.mutes[toMute.id] = {
        guild: message.guild.id,
        time: Date.now() + muteTime * 1000
    }

    fs.writeFile("./datastorage/mutes.json", JSON.stringify(bot.mutes, null, 4), (err: Error) => {
        if (err) throw err;
        message.channel.send("Muted that user!").catch();
    });

    await toMute.roles.add(role).catch();
}
module.exports.help = {
    name: "mute"
}