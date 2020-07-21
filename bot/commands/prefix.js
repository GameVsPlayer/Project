const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {

    if (!message.member.hasPermission("MANAGE_SERVER")) return errors.noPerms(message, "MANAGE_SERVER").catch();
    let prefixes = await bot.db.prefixes.findOne({
        guildID: message.guild.id
    })
    if (!args[0] || args[0 === "help"]) return message.reply(`Usage: ${prefixes.prefix}prefix <The prefix you want to set for the server>`).catch();

    let oldPrefix = prefixes.prefix;

    await bot.db.prefixes.findOneAndUpdate({
        guildID: message.guild.id
    }, {
        "$set": {
            prefix: args[0].toString()
        }
    });

    let Embed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .setTitle("Prefix changed!")
        .setDescription(`Set from ${oldPrefix}  to ${args[0]}`);

    message.channel.send(Embed).catch();

}

module.exports.help = {
    name: "prefix"
}