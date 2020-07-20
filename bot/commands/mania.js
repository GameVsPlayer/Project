const Discord = require("discord.js");

const superagent = require("superagent");
const stripTags = require("striptags");

module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("OSU API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified");
    usernameRequst = args[0].toString();
    var url = `https://osu.ppy.sh/api/get_user?u=${usernameRequst}&k=${bot.config.osuAPI}&m=3&type=string&event_days=5`
    let {
        body
    } = await superagent
        .get(url).catch()
    if (!body[0]) return message.reply("That user could not be found!").catch();
    country0 = body[0].country;
    country = country0.toLowerCase();
    countryFlag = `:flag_${country}:`;
    pp = parseFloat(body[0].pp_raw).toFixed(0)
    level = parseFloat(body[0].level).toFixed(2);
    rank = body[0].pp_rank;
    playcount = body[0].playcount;
    username = body[0].username;
    accuracy = parseFloat(body[0].accuracy).toFixed(2);
    user_id = body[0].user_id;
    Avatar = `https://s.ppy.sh/a/${user_id}`
    if (body[0].pp_raw = NaN) return message.reply("No Data for that user found").catch();

    var osuBeatMapUrl = "https://osu.ppy.sh/beatmapsets/"
    recentScoresArray = [];
    events = body[0].events;
    for (i = 0; i < (body[0].events).length && i < 2; i++) {
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
            url: osuBeatMapUrl + events[i].beatmapset_id + "/#mania/" + events[i].beatmap_id,
            date: `at ${events[i].date} GMT`
        })
    }
    if (recentScoresArray.length < 1) {
        var recentScores = "None";

    } else if (recentScoresArray.length < 2) {
        var recentScores = `[${recentScoresArray[0].name}](${recentScoresArray[0].url}) ${recentScoresArray[0].date}`;
    } else if (recentScoresArray.length >= 2) {
        var recentScores = `[${recentScoresArray[0].name}](${recentScoresArray[0].url}) ${recentScoresArray[0].date}
        [${recentScoresArray[1].name}](${recentScoresArray[1].url}) ${recentScoresArray[1].date}`;
    }

    osuEmbed = new Discord.MessageEmbed()
        .setTitle(`**${username} osuMania**`)
        .addField("PP", `${pp}`)
        .addField("Accuracy", `${accuracy}%`, true)
        .addField("Playcount", `${playcount}`, true)
        .addField("Level", `${level}`, true)
        .addField("Rank", `${rank}`, true)
        .setFooter(`${username} is from ${country0}`)
        .setThumbnail(Avatar)
        .addField("Recent Activities", recentScores)
        .setDescription(`[Profile](https://osu.ppy.sh/u/${user_id})`);

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "mania"
}