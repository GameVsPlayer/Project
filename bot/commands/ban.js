const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let bUser = message.guild.member(message.mentions.users.first() || members.guild.member.get(args[0])).catch();
    if (!bUser) return message.channel.send("Can't find user!").catch();
    let bReason = args.join(" ").slice(22);
    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I do not have the permission to perform that action!")
    if (!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS").catch();
    if (bUser.hasPermission("BAN_MEMBERS")) {
        try {
            return message.channel.send("That Person can't be banned!")
                .then((message) => {
                    message.delete({ timeout:5000}).catch();
                });
        } catch {}
    };
    if (!bReason) bReason = "no reason specified"
    let banEmbed = new Discord.MessageEmbed()
        .setDescription("Ban")
        .setColor("#FF0000")
        .addField("Banned User", `${bUser} with ID ${bUser.id}`)
        .addField("Banned by", `<@${message.author.id}> with ID ${message.author.id}}`)
        .addField("Banned in", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", bReason);

    let banChannel = message.guild.channels.find(`name`, "reports").catch();
    if (!banChannel) {
        try {
            return message.channel.send("Can't find Reports Channel.")
                .then((message) => {
                    message.delete({ timeout:5000}).catch();
                });
        } catch {}
    };


    message.guild.member(bUser).ban(bReason).catch();

    banChannel.send(banEmbed).catch();
}
module.exports.help = {
    name: "ban"
}