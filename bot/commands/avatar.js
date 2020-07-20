const Discord = require("discord.js");

const shortUrl = require('tinyurl');


module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");

    let memberA = await bot.extra.autocomplete(message, args);

    let avatarURL = await memberA.user.avatarURL({ format: 'png', dynamic: true, size: 2048 });
    let avatarURLSmall = await memberA.user.avatarURL({ format: 'png', dynamic: true, size: 128 });
    if(!avatarURL) return message.channel.send("This users doesn\'t have a Avatar!");

    shortUrl.shorten(`${avatarURL}`, function (avatarLink, err) {

        let embed = new Discord.MessageEmbed()
            .addField("Avatar", `${memberA}`)

            .setImage(`${avatarURLSmall}`)

            .setDescription(`**LINK** ${avatarLink}`)

        message.channel.send(embed).catch((err) => bot.logger.error(err));
    });
}
module.exports.help = {
    name: "avatar",
    alias: "av"
}