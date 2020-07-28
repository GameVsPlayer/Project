module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("osu API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    let username = [];
    for (i in args) {
        if (args[i].startsWith('"') || args[i].startsWith("'")) {
            start = true
            username.push(args[i]);
            start = false;
        } else if ((args[i].endsWith('"') || args[i].endsWith("'")) && start === false) {
            username.push(args[i])
            break;
        } else {
            username.push(args[i]);
            break;
        }
    }
    username = username.join(" ");
    username = username.replace(/'/g, '')
    username = username.replace(/"/g, "")
    bot.extra.osu.setUser(bot, message, username)

    message.channel.send(`Username set to ${username}`).catch();

}
module.exports.help = {
    name: "osuset",
    alias: "os"
}