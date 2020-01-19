const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let rUser = message.guild.member(message.mentions.users.first() || members.guild.member.get(args[0]));
    if (!rUser) {
        return message.channel.send("Couldn't find user.")
            .then((message) => {
                message.delete(5000).catch();
            });
    }
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
        .setDescription("Reports")
        .setColor(`${bot.config.color}`)
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Report By", `${message.author} with ID: ${message.author.id}"`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reason);

    let reportsChannel = message.guild.channels.find(`name`, "reports").catch();
    if (!reportsChannel) {
        return message.channel.send("Couldn't find reports channel.")
            .then((message) => {
                message.delete(5000).catch();
            });
    }

    message.delete().catch((O_o) => {});
    reportsChannel.send(reportEmbed).catch();
}
module.exports.help = {
    name: "report"
}