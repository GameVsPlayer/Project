import { Message, GuildMember } from "discord.js";

import fs from "fs";
const errors = require("../utils/errors.js");


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms("MANAGE_MESSAGES").catch();

    let toMute: GuildMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
    if (!toMute) return message.channel.send("You didn't specify a user").catch();
    let role = message.guild.roles.cache.find((r) => r.name === "Karen Muted");

    if (!role || !toMute.roles.cache.has(role.id)) return message.channel.send("This user is not muted").catch();

    await toMute.roles.remove(role).catch();

    delete bot.mutes[toMute.id];

    fs.writeFile("../datastorage/mutes.json", JSON.stringify(bot.mutes), (err: Error) => {
        if (err) throw err;
    });
}

module.exports.help = {
    name: "unmute"
}