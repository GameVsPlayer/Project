const Discord = require("discord.js");
const math = require("mathjs");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.reply("Please enter a calculation!").catch();

    let resp
    try {
        resp = math.eval(args.join(' '));
    } catch (e) {
        return message.reply("That is not a valid calculation!").catch();
    }

    const embed = new Discord.RichEmbed()
        .setColor(bot.config.color)
        .setTitle("Math Calculation")
        .addField('Input', `\`\`\`js\n${args.join('')}\`\`\``)
        .addField('Output', `\`\`\`js\n${resp}\`\`\``)

    message.channel.send(embed).catch();



}
module.exports.help = {
    name: "calc"
}