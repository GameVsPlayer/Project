import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";

const superagent = require("superagent");
import stripTags from "striptags";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (bot.config.osuAPI === "") return bot.logger.info("osu! API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    const usernameRequst: string = args[0].toString();
    var url = `https://osu.ppy.sh/api/get_user?u=${usernameRequst}&k=${bot.config.osuAPI}&m=1&type=string&event_days=5`
    let {
        body
    } = await superagent
        .get(url).catch((err: Error) => {
            return message.channel.send(`Something went wrong: ${err}`)
        })
    if (!body[0]) return message.reply("That user could not be found!").catch();
    const country0: string = body[0].country;
    const country: string = country0.toLowerCase();
    const countryFlag: string = `:flag_${country}:`;
    const pp: string = parseFloat(body[0].pp_raw).toFixed(0)
    const level: string = parseFloat(body[0].level).toFixed(2);
    const rank: number = body[0].pp_rank;
    const playcount: number = body[0].playcount;
    const username: string = body[0].username;
    const accuracy: string = parseFloat(body[0].accuracy).toFixed(2);
    const user_id: number = body[0].user_id;
    const Avatar: string = `https://s.ppy.sh/a/${user_id}`
    if (body[0].pp_raw = NaN) return message.reply("No Data for that user found").catch();

    var osuBeatMapUrl = "https://osu.ppy.sh/beatmapsets/"
    let recentScoresArray: Array<any> = [];
    let recentScores: string;
    let events: Array<any> = body[0].events;
    if (body[0].pp_raw = NaN) return message.reply("No Data for that user found").catch();

    for (let i = 0; i < (body[0].events).length && i < 2; i++) {
        var display_event = stripTags(events[i].display_html);


        if (display_event.includes("osu!supporter")) recentScoresArray.push({
            name: display_event,
            url: "https://osu.ppy.sh/home/support",
            date: `at ${events[i].date} GMT`
        })
        else if (display_event.includes("medal")) recentScoresArray.push({
            name: display_event,
            url: "",
            date: `at ${events[i].date} GMT`
        })

        else recentScoresArray.push({
            name: display_event,
            url: osuBeatMapUrl + events[i].beatmapset_id + "/#osu/" + events[i].beatmap_id,
            date: `at ${events[i].date} GMT`
        })
    }
    if (recentScoresArray.length < 1) {
        recentScores = "None";

    } else if (recentScoresArray.length < 2) {
        recentScores = `[${recentScoresArray[0].name}](${recentScoresArray[0].url}) ${recentScoresArray[0].date}`;
    } else if (recentScoresArray.length >= 2) {
        recentScores = `[${recentScoresArray[0].name}](${recentScoresArray[0].url}) ${recentScoresArray[0].date}
        [${recentScoresArray[1].name}](${recentScoresArray[1].url}) ${recentScoresArray[1].date}`;
    }



    const osuEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setTitle(`**${username} osuTaiko**`)
        .addField("PP", `${pp}`)
        .addField("Accuracy", `${accuracy}%`, true)
        .addField("Playcount", `${playcount}`, true)
        .addField("Level", `${level}`, true)
        .addField("Rank", `${rank}`, true)
        .setFooter(`${username} is from ${country0}`)
        .setThumbnail(Avatar)
        .addField("Rank", `${rank}`, true)
        .addField("Recent Activities", recentScores)
        .setDescription(`[Profile](https://osu.ppy.sh/u/${user_id})`)

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "taiko"
}