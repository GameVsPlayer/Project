const fs = require("fs");
const errors = require("../utils/errors.js");


module.exports.run = async (bot, message, args) => {

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms("MANAGE_MESSAGES").catch();
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.reply("I do not have the permission to perform that action");
    let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!toMute) {
        return message.channel.send("You did not  specify a user").catch();
    }
    if (!args[1]) {
        return message.reply("No time specified!").catch();
    }
    if (isNaN(args[1])) {
        return message.reply("That is not a number!").catch();
    }
    var muteTime = Math.floor(args[1]);
    if (toMute.id === message.author.id) {
        return message.channel.send("You can't mute yourself.").catch();
    }
    if (toMute.highestRole.position >= message.member.highestRole.position) {
        return message.channel.send("You cannot mute a member who has a higher role than you.").catch();
    }

    let role = message.guild.roles.find((r) => r.name === "Karen Muted");
    if (!role) {
        try {
            role = await message.guild.createRole({
                name: "Karen Muted",
                color: "#000000",
                permissions: []
            }).catch();
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }

    if (toMute.roles.has(role.id)) {
        return message.channel.send("This user is already muted!").catch();
    }
    bot.mutes[toMute.id] = {
        guild: message.guild.id,
        time: Date.now() + parseInt(muteTime) * 1000
    }

    fs.writeFile("./datastorage/mutes.json", JSON.stringify(bot.mutes, null, 4), (err) => {
        if (err) throw err;
        message.channel.send("Muted that user!").catch();
    });

    await toMute.addRole(role).catch();
}
module.exports.help = {
    name: "mute"
}