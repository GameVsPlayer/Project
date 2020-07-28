const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("osu API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    usernameRequst = args.join(" ");
    let Mod, cs, hp;

    let APIData = await bot.extra.osu.recent(bot, usernameRequst, "osu", 1);
    if (APIData === "no plays") return message.channel.send(`${usernameRequst} does not have any recent plays`);
    await bot.extra.osu.dlMap({
        APIData
    });

    let bm = path.join(__dirname, `/../maps/${APIData.beatmap_id}.osu`);

    let Map = await bot.extra.osu.mapInfo(bm);

    let Mods = bot.extra.osu.enum2Mods(APIData.enabled_mods);
    Mod = Mods[0].join(", ");

    let player = await bot.extra.osu.player(bot, usernameRequst, "osu");

    let modStat = await bot.extra.osu.calcCSHP(Mod, Map)
    cs = modStat[0];
    hp = modStat[1];

    let bpm = await bot.extra.osu.calcBPM(Mod, Map.bpm);

    let dotnet = '';
    for (mod in Mods[0]) {
        dotnet = dotnet + `-m ${Mods[0][mod]} `;
    }

    function replaceAll(str) {
        str = str.replace(new RegExp(', ', 'g'), '');
        str.replace(new RegExp('NC', 'g'), 'DT');
        str = '+' + str;
        return str;
    }
    let playStats = {
        mods: replaceAll(Mod),
        combo: APIData.maxcombo,
        misses: APIData.countmiss,
        count100: APIData.count100,
        count300: APIData.count300,
        count50: APIData.count50
    }
    let mapPlay = await bot.extra.osu.calcPP(bot, bm, playStats, dotnet, "osu");

    let sr = await bot.extra.osu.calcMap(bot, bm, dotnet);
    let mapPlayFC = {};
    if (APIData.perfect !== '1') {
        await new Promise(async function (resolve, reject) {
            playStats.misses = 0;
            playStats.combo = mapPlay.maxCombo;
            mapPlayFC = await bot.extra.osu.calcPP(bot, bm, playStats, dotnet, "osu");
            resolve();
        })
    }

    osuEmbed = new Discord.MessageEmbed()
        .setAuthor(`${player.username}'s Recent Play Try ${APIData.try}`, `https://b.ppy.sh/thumb/${Map.beatmapset_id}.jpg`)
        .setDescription(`${Map.title} [${Map.version}](https://osu.ppy.sh/b/${Map.beatmap_id}) + ${Mod} [${parseFloat(sr).toFixed(2)}★] \n` +
            `${APIData.rank} Rank ${mapPlay.accuracy}% ${mapPlay.pp}${mapPlayFC !== undefined ? "(" + mapPlayFC.pp +")": ""}PP\n` +
            `Score: ${APIData.score}\n` +
            `Combo: ${mapPlay.combo}x/${mapPlay.maxCombo}x ${APIData.count300}/${APIData.count100}/${APIData.count50}/${APIData.countmiss}\n` +
            `Mapper: ${Map.creator}\n` +
            `BPM: ${bpm}${bpm == Map.bpm ? '' : '('+ Map.bpm + ')'} Divisor 1/${Map.divisor}\n` +
            `Play set at ${APIData.date}\n` +
            `**AR** ${mapPlay.ar}${mapPlay.ar == Map.diff_approach ? '' : '('+ Map.diff_approach + ')'} **OD** ${mapPlay.od}${mapPlay.od == Map.diff_overall ? '' : '('+ Map.diff_overall + ')'} **CS** ${cs}${cs == Map.diff_size ? '' : '('+ Map.diff_size + ')'} **HP** ${hp}${hp == Map.diff_drain ? '' : '('+ Map.diff_drain + ')'}`)
        .setThumbnail(`https://s.ppy.sh/a/${player.user_id}`)

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "osurecent",
    alias: "rs"
}