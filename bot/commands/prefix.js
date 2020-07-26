const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_SERVER")) return errors.noPerms(message, "MANAGE_SERVER").catch();
    let prefix;
    await new Promise(function(resolve,reject) {
        await bot.extra.getPrefix(bot, message.guild, function(prefixCB) {
        prefix = prefixCB;
        resolve();
    });
    });

    if (!args[0] || args[0 === "help"]) return message.reply(`Usage: ${prefix}prefix <The prefix you want to set for the server>`).catch();

    await bot.extra.setPrefix(bot, message.guild, args[0], function(prefixCB) {
    });

    let Embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle("Prefix changed!")
        .setDescription(`Set from ${prefix} to ${args[0]}`);

    message.channel.send(Embed).catch();

}

module.exports.help = {
    name: "prefix"
}