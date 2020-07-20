const Discord = require("discord.js");
const sm = require("string-similarity");

const shortUrl = require('tinyurl');

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");
    let memberA;
    if (args[0]) {
        if (message.mentions.users.first() != undefined) {

            let username = message.mentions.users.first();

            memberA = username.id;
        }

        if (!memberA) {
            let members = [];
            let indexes = [];
            message.guild.members.forEach((member) => {
                members.push(member.user.username);
                indexes.push(member.id);
            })

            let match = sm.findBestMatch(args.join(' '), members);

            let username = match.bestMatch.target;

            global.autocomplete = message.guild.members.fetch(indexes[members.indexOf(username)]);
        }
    } else {
        memberA = message.author;
    }
    memberA = memberA || global.autocomplete || message.author;
    if (!memberA) return message.reply("No user found.").catch((err) => bot.logger.error(err));
    memberA = await message.guild.members.fetch(memberA.id || memberA);

    avatarURL = memberA.user.avatarURL({ format: 'png', dynamic: true, size: 1024 });

    shortUrl.shorten(`${avatarURL}?size=2048`, function (avatarLink, err) {

        let embed = new Discord.MessageEmbed()
            .addField("Avatar", `${memberA}`)

            .setImage(`${avatarURL}?size=128`)

            .setDescription(`**LINK** ${avatarLink}`)

        message.channel.send(embed).catch((err) => bot.logger.error(err));
    });
}
module.exports.help = {
    name: "avatar",
    alias: "av"
}