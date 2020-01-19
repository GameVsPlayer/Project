const fs = require("fs");
const errors = require("../utils/errors.js");


module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms("MANAGE_MESSAGES").catch();

    let toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!toMute) return message.channel.send("You didn't specify a user").catch();

    let role = message.guild.roles.find((r) => r.name === "Karen Muted").catch();
    if (!role || !toMute.roles.has(role.id)) return message.channel.send("This user is not muted").catch();

    await toMute.removeRole(role).catch();

    delete bot.mutes[toMute.id];

    fs.writeFile("../datastorage/mutes.json", JSON.stringify(bot.mutes), (err) => {
        if (err) throw err;
    });
}

module.exports.help = {
    name: "unmute"
}