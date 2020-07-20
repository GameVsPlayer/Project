const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[0]));
    if (!kUser) {
        return message.channel.send("Can't find user!")
            .then((message) => {
                message.delete({ timeout:5000}).catch();
            });
    }

    let kReason = args.join(" ").slice(22);
    if (!message.member.hasPermission("KICK_MEMBERS")) {
        return errors.noPerms(message, "KICK_MEMBERS");
    }
    if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("I do not have the permissions to kick a user");
    }
    if (kUser.hasPermission("KICK_MEMBERS")) {
        return message.channel.send("That Person can't be kicked!")
            .then((message) => {
                message.delete({ timeout:5000}).catch();
            });
    }
    if (!kReason) kReason = "no reason specified";
    let kickEmbed = new Discord.MessageEmbed()
        .setDescription("Kick")
        .setColor("#FF0000")
        .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
        .addField("Kicked by", `<@${message.author.id}> with ID ${message.author.id}}`)
        .addField("Kicked in", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "reports");
    if (!kickChannel) {
        return message.channel.send("Can't find reports Channel.")
            .then((message) => {
                message.delete({ timeout:5000}).catch();
            });
    }

    message.guild.member(kUser).kick(kReason).catch();

    kickChannel.send(kickEmbed).catch();

}
module.exports.help = {
    name: "kick"
}