import { Message, MessageEmbed, GuildMember } from "discord.js";

import Discord from "discord.js";
const shortUrl = require('tinyurl');
import moment from "moment-timezone";


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");

    let memberA = await bot.extra.autocomplete(bot, message, args);


    memberA = memberA || message.author;
    if (!memberA) return message.reply("No user found.").catch((err) => bot.logger.error(err));
    memberA = await message.guild.members.fetch(memberA.id || memberA);

    const avatarURL: any = memberA.user.avatarURL({ format: 'png', dynamic: true, size: 1024 });
    const gMember = message.guild.member(memberA);
    let statusIcon: any, game: any;
    try {
        if (memberA.user == undefined) var createdAt = memberA.createdAt;
        else var createdAt = memberA.user.createdAt;
        var joinedAt = gMember.joinedAt;

        if (memberA.presence.status == "online") statusIcon = "[Online]";
        else if (memberA.presence.status == "idle") statusIcon = "[Idle]";
        else if (memberA.presence.status == "dnd") statusIcon = "[DnD]";
        else if (memberA.presence.activities !== null)
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


    } catch (e) { }

    if (gameF == undefined) gameF = memberA.presence.activities;

    let fetched = message.guild.members.cache.get(memberA.id);

    let roles: any = fetched.roles.cache;
    let rolesName: any = Array.from(roles);

    let rolesCount = rolesName.length;

    let mentionRole: any = [];



    for (let i = 0; i < rolesCount; i++) {
        let filteredNames = rolesName[i].splice(1);
        mentionRole.push(`${filteredNames}`);
    }

    let timeJD = moment(createdAt);
    let timeS = moment(joinedAt);

    if (mentionRole !== undefined) mentionRole = mentionRole.toString();
    shortUrl.shorten(`${avatarURL}?size=2048`, function (avatarLink: string, err: Error) {

        if (err) return bot.logger.info(err);
        let embed: MessageEmbed = new Discord.MessageEmbed()

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