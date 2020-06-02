const Discord = require("discord.js");
const fs = require("fs");
const botcolor = "#00ccff";
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_SERVER")) return errors.noPerms(message, "MANAGE_SERVER").catch();
    if (!args[0] || args[0 === "help"]) return message.reply(`Usage: !prefix <The prefix you want to set for the server>`).catch();

    let prefixes = JSON.parse(fs.readFileSync("./datastorage/prefixes.json", "utf8"));

    prefixes[message.guild.id] = {
        prefixes: args[0]
    };

    fs.writeFile("./datastorage/prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) {
            bot.logger.info(err)

        }
    });

    let sEmbed = new Discord.RichEmbed()
        .setColor(botcolor)
        .setTitle("Prefix Set!")
        .setDescription(`Set to ${args[0]}`);

    message.channel.send(sEmbed).catch();

}

module.exports.help = {
    name: "prefix"
}