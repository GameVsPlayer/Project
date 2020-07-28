module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("osu API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    let username = [];

    for (i in args) {
        if (args[i].includes("-t"))
            gamemode = "taiko"
        else if (args[i].includes("-m"))
            gamemode = "mania"
        else if (args[i].includes("-c"))
            gamemode = "catch"
        else
            gamemode = "osu"
    }
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
    if (!gamemode) gamemode = "osu";
    bot.extra.osu.setUser(bot, message, username, gamemode)

    message.channel.send(`Username set to ${username}`).catch();

}
module.exports.help = {
    name: "osuset",
    alias: "os"
}