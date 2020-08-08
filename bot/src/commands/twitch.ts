import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";

import fetch from 'node-fetch';
import moment from "moment-timezone";


module.exports.run = async (bot: any, message: Message, args: string[]) => {

    if (bot.config.TwitchID === "") return bot.logger.info("Twitch ID not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified");
    let idGrab: any = await fetch(`https://api.twitch.tv/helix/users?login=${args[0]}`, {
        method: 'GET',
        headers: {
            "Client-ID": `${bot.config.TwitchID}`,
            "Authorization": `Bearer ${bot.config.TwitchAuth}`
        }
    });

    idGrab = await idGrab.json();

    idGrab = idGrab.data[0];

    var url = `https://api.twitch.tv/helix/streams?user_id=${idGrab.id}`;
    var url2 = `https://api.twitch.tv/helix/channels?user_id=${idGrab.id}`;

    let followers: any = `https://api.twitch.tv/helix/users/follows?to_id=${idGrab.id}`;

    followers = await fetch(followers, {
        method: 'GET',
        headers: {
            "Client-ID": bot.config.TwitchID,
            "Authorization": `Bearer ${bot.config.TwitchAuth}`
        }
    });

    followers = await followers.json();

    followers = followers.total;

    let body: any = await fetch(url, {
        method: 'GET',
        headers: {
            "Client-ID": bot.config.TwitchID,
            "Authorization": `Bearer ${bot.config.TwitchAuth}`
        }
    }).catch();
    body = await body.json();
    body = body.data[0]




    if (body === undefined) {

        let body2: any = await fetch(url2, {
            method: 'GET',
            headers: {
                "Client-ID": bot.config.TwitchID
            }
        })
        body2 = await body2.json();

        const offlineEmbed: MessageEmbed = new Discord.MessageEmbed()
            .setTitle(`Twitch info of ${idGrab.login} `)
            .addField("Status", `Currently offline⚫`, true)
            .addField("Channel type", (idGrab.broadcaster_type).toUpperCase())
            .setColor(bot.config.color)
            .setFooter(`Followers: ${followers} | Total Views: ${idGrab.view_count}`)
            .setURL(`https://twitch.tv/${idGrab.login}`)
            .setThumbnail(idGrab.profile_image_url);

        return message.channel.send(offlineEmbed).catch();


    } else {

        let game: any = await fetch(`https://api.twitch.tv/helix/games?id=${body.game_id}`, {
            method: 'GET',
            headers: {
                "Client-ID": bot.config.TwitchID,
                "Authorization": `Bearer ${bot.config.TwitchAuth}`
            }
        });
        game = await game.json();
        game = game.data[0].name;

        const now: number = moment.now();
        const bodyConv: any = body.stream;

        let time = moment(body.started_at);
        let up = moment(now).diff(moment(time))
        let uptime = moment.duration(up, "milliseconds");

        let days: number = uptime.days()
        let hours: number = uptime.hours()
        let minutes: number = uptime.minutes()
        let seconds: number = uptime.seconds();

        let uptimeDays: string, uptimeHours: string, uptimeMinutes: string, uptimeSeconds: string;

        if (days == 1) uptimeDays = `${days} Day`;
        else if (days > 1) uptimeDays = `${days} Days`;
        else uptimeDays = "";

        if (hours == 1) uptimeHours = `${hours} Hour`;
        else if (hours > 1) uptimeHours = `${hours} Hours`;
        else uptimeHours = "";

        if (minutes == 1) uptimeMinutes = `${minutes} Minute`;
        else if (minutes > 1) uptimeMinutes = `${minutes} Minutes`;
        else uptimeMinutes = "";

        if (seconds == 1) uptimeSeconds = `${seconds} Second`;
        else if (seconds > 1) uptimeSeconds = `${seconds} Seconds`;
        else uptimeSeconds = "";

        const onlineEmbed: MessageEmbed = new Discord.MessageEmbed()
            .setTitle(`Twitch info of ${idGrab.login}`)
            .addField("Status", `${body.type.toUpperCase()}🔴`, true)
            .setDescription(`**__Now Streaming: ${game} \n ${body.title}__**`)
            .setColor(bot.config.color)
            .setFooter(`Followers: ${followers} | Total Views: ${idGrab.view_count}`)
            .addField("Viewer Count", body.viewer_count, true)
            .setThumbnail(idGrab.profile_image_url)
            .setURL(`https://twitch.tv/${idGrab.login}`)
            .addField("Uptime", `${uptimeDays} ${uptimeHours} ${uptimeMinutes} ${uptimeSeconds}`, true);

        return message.channel.send(onlineEmbed).catch();
    }
}

module.exports.help = {
    name: "twitch"
}