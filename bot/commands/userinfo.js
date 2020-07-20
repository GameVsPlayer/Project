const Discord = require("discord.js");
const shortUrl = require('tinyurl');
const sm = require("string-similarity");
const moment = require("moment-timezone");


module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");
    let memberA;
    if (args[0]) {

        if (message.mentions.users.first() !== undefined) {

            let username = message.mentions.users.first();

            memberA = username;
        }
        if (memberA == undefined) {
            let members = [];
            let indexes = [];
            message.guild.members.forEach((member) => {
                members.push(member.user.username);
                indexes.push(member.id);
            })

            let match = sm.findBestMatch(args.join(' '), members);

            let username = match.bestMatch.target;

            memberA = message.guild.members.fetch(indexes[members.indexOf(username)]);
        }
    } else {
        memberA = message.author;
    }
    if (!memberA) return message.reply("No user found.").catch();


    memberA = memberA || global.autocomplete || message.author;
    if (!memberA) return message.reply("No user found.").catch((err) => bot.logger.error(err));
    memberA = await message.guild.members.fetch(memberA.id || memberA);

    avatarURL = memberA.user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
    const gMember = message.guild.member(memberA);
    let statusIcon;
    try {
        if (memberA.user == undefined) var createdAt = memberA.createdAt;
        else var createdAt = memberA.user.createdAt;
        var joinedAt = gMember.joinedAt;

        if (memberA.presence.status == "online") statusIcon = "[Online]";
        if (memberA.presence.status == "idle") statusIcon = "[Idle]";
        if (memberA.presence.status == "dnd") statusIcon = "[DnD]";
        if (memberA.presence.activities !== null)
            if (memberA.presence.activities.url !== null) statusIcon = "[Streaming]";
        if (statusIcon === null) statusIcon = "[Offline]";
        if (memberA.presence.activities !== undefined && statusIcon == "[Streaming]" && memberA.presence.activities.timestamps !== null && memberA.presence.activities.url !== null) game = {
            name: `Title: ${memberA.presence.activities.name} \n streaming at ${memberA.presence.activities.url}`,
            time: ""
        }
        else if (memberA.presence.activities !== undefined && statusIcon == "[Streaming]" && memberA.presence.activities.url !== null) game = {
            name: `Title: ${memberA.presence.activities.name} \n streaming at ${memberA.presence.activities.url}`,
            time: ""
        }
        else if (memberA.presence.activities !== undefined && memberA.presence.activities.timestamps !== null && memberA.presence.activities.timestamps.start !== null && memberA.presence.activities.name == "Spotify") game = {
            name: memberA.presence.activities.name,
            songName: memberA.presence.activities.details,
            playlist: memberA.presence.activities.assets.largeText,
            artist: memberA.presence.activities.state,
            time: moment(memberA.presence.activities.timestamps.start).fromNow()
        }
        else if (memberA.presence.activities !== undefined && memberA.presence.activities.timestamps !== undefined && memberA.presence.activities.timestamps.start !== null) game = {
            name: memberA.presence.activities.name,
            time: moment(memberA.presence.activities.timestamps.start).fromNow()
        }
        else if (memberA.presence.activities !== undefined) game = {
            name: memberA.presence.activities.name,
            time: ""
        }
        else game = {
            name: "None",
            time: "0"
        };


        if (game.name.length > 0 && game.time.length > 0 && game.name !== "Spotify") var gameF = `${game.name} playing Since ${game.time}`;
        else if (game.name == "Spotify" && memberA.presence.activities.assets.largeImage.startsWith("spotify:")) var gameF = `${game.name} playing ${game.songName} \n by ${game.artist} \n in playlist ${game.playlist}`;
        else if (game.name.length > 0 && gameF === null) var gameF = `${game.name}`;
        else var gameF = "Nothing playing right now";


    } catch (e) {}

    if (gameF == undefined) gameF = memberA.presence.activities;

    if (memberA.roles == undefined) {
        var fetched = message.guild.members.fetch(memberA.id);
        memberA.roles = fetched.roles;
    }
    var rolesName = Array.from(memberA.roles);

    var rolesCount = (memberA.roles).size;

    const newLocal = [];
    var mentionRole = newLocal;

    for (let i = 0; i < rolesName.length; i++) {
        var filteredNames = rolesName[i].splice(1);
        mentionRole.push(`${filteredNames}`);


    }


    var timeJD = moment(createdAt);
    var timeS = moment(joinedAt);

    if (mentionRole !== undefined) var mentionRole = mentionRole.toString();
    shortUrl.shorten(`${avatarURL}?size=2048`, function (avatarLink, err) {

        if (err) return bot.logger.info(err);
        let embed = new Discord.MessageEmbed()

            .setDescription(`**${memberA}'s Info**`)
            .addField("Avatar url", avatarLink, true)
            .addField(`Joined ${message.guild.name}`, moment(timeS).format("DD/MM/YYYY hh:mm:ss"), true)
            .addField("Joined Discord", `${moment(timeJD).format("DD/MM/YYYY hh:mm:ss")}`, true)
            .addField("ID", memberA.id, true)
            .addField("Roles", `Number of roles [${rolesCount}] ${mentionRole}`, true)
            .addField(`Status ${statusIcon}`, gameF, true)
            .setThumbnail(`${avatarURL}?size=128`)
            .setColor(bot.config.color);

        return message.channel.send(embed)
    });
};
module.exports.help = {
    name: "userinfo",
    alias: "ui"
}