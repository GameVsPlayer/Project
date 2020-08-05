import { Message, MessageEmbed, GuildChannel } from "discord.js";

import Discord from "discord.js";
module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
    if (!rUser) {
        return message.channel.send("Couldn't find user.")
            .then((message) => {
                message.delete({ timeout: 5000 }).catch();
            });
    }
    let reason = args.join(" ").slice(22);

    let reportEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setDescription("Reports")
        .setColor(`${bot.config.color}`)
        .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
        .addField("Report By", `${message.author} with ID: ${message.author.id}"`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", reason);
    message.channel.fetch()
    let reportsChannel: any = message.guild.channels.cache.get("reports");
    reportsChannel = await message.channel.fetch()
    if (!reportsChannel) {
        return message.channel.send("Couldn't find reports channel.")
            .then((message) => {
                message.delete({ timeout: 5000 }).catch();
            });
    }

    message.delete().catch((O_o: null) => { });
    reportsChannel.send(reportEmbed).catch();
}
module.exports.help = {
    name: "report"
}