const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("osu API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    usernameRequst = [];
    let Mod, cs, hp, position;

    let gamemode;

    let start = false;
    for (i in args) {
        if (args[i].startsWith('"') || args[i].startsWith("'")) {
            start = true
            usernameRequst.push(args[i]);
            start = false;
        } else if ((args[i].endsWith('"') || args[i].endsWith("'")) && start === false) {
            usernameRequst.push(args[i])
            break;
        } else {
            usernameRequst.push(args[i]);
            break;
        }
    }

    let argsShift = usernameRequst.length;
    usernameRequst = usernameRequst.join(" ");
    usernameRequst = usernameRequst.replace(/'/g, '')
    usernameRequst = usernameRequst.replace(/"/g, "")
    if (args[argsShift]) args = args.slice(argsShift);
    for (i in args) {
        if (args[i].includes("-t"))
            gamemode = "taiko"
        else if (args[i].includes("-m"))
            gamemode = "mania"
        else if (args[i].includes("-c"))
            gamemode = "catch"
        else
            gamemode = "osu"
    }
    if (!isNaN(parseInt(args[0]))) {
        position = args[0];
    } else if (!isNaN(parseInt(args[1]))) {
        position = args[1];
    } else position = 1;

    console.log(position);
    let APIData = await bot.extra.osu.userBest(bot, usernameRequst, gamemode);
    await bot.extra.osu.dlMap(APIData);

    APIData = APIData[parseInt(position) - 1];



    let bm = path.join(__dirname, `/../maps/${APIData.beatmap_id}.osu`);

    let Map = await bot.extra.osu.mapInfo(bm);

    let Mods = bot.extra.osu.enum2Mods(APIData.enabled_mods);
    Mod = Mods[0].join(", ");

    let player = await bot.extra.osu.player(bot, usernameRequst, gamemode);

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
        count50: APIData.count50,
        score: APIData.score
    }
    let mapPlay = await bot.extra.osu.calcPP(bot, bm, playStats, dotnet, gamemode);

    let sr = await bot.extra.osu.calcMap(bot, bm, dotnet, gamemode);
    if (gamemode === "catch") {
        mapPlay.maxCombo = sr[1];
        mapPlay.ar = sr[2];
    } else if (gamemode === "taiko") {
        mapPlay.maxcombo = sr[2]
    }
    sr = sr[0];
    let mapPlayFC = {};
    if (APIData.perfect !== '1') {
        await new Promise(async function (resolve, reject) {
            playStats.misses = 0;
            playStats.combo = mapPlay.maxCombo;
            if (gamemode === "mania") playStats.score = 1000000;
            mapPlayFC = await bot.extra.osu.calcPP(bot, bm, playStats, dotnet, gamemode);
            resolve();
        })
    } else {
        mapPlay.maxCombo = mapPlay.combo;
    }

    osuEmbed = new Discord.MessageEmbed()
        .setAuthor(`${player.username}'s Top Play in ${gamemode}`, `https://b.ppy.sh/thumb/${Map.beatmapset_id}.jpg`)
        .setDescription(`${Map.title} [${Map.version}](https://osu.ppy.sh/b/${Map.beatmap_id}) + ${Mod} [${parseFloat(sr).toFixed(2)}★] \n` +
            `${APIData.rank} Rank ${mapPlay.accuracy ==! undefined ? mapPlay.accuracy + "%": ""} ${mapPlay.pp}${mapPlayFC !== undefined & !isNaN(mapPlayFC.pp)? "(" + mapPlayFC.pp +")": ""}PP\n` +
            `Score: ${APIData.score}\n` +
            `Combo: ${APIData.maxcombo}${mapPlay.maxCombo !== undefined ? "x/"+ mapPlay.maxCombo +"x": "x"} ${APIData.count300}/${APIData.count100}/${APIData.count50}/${APIData.countmiss}\n` +
            `Mapper: ${Map.creator}\n` +
            `BPM: ${bpm}${bpm == Map.bpm ? '' : '('+ Map.bpm + ')'} Divisor 1/${Map.divisor}\n` +
            `Play set at ${APIData.date} ${APIData.replay_available === '0' ? 'No replay available' : `Replay available [here](https://osu.ppy.sh/scores/osu/${APIData.score_id}/download)`}\n` +
            `**AR** ${mapPlay.ar || Map.diff_approach}${mapPlay.ar == Map.diff_approach | mapPlay.ar === undefined ? '' : '('+ Map.diff_approach + ')'} **OD** ${mapPlay.od || Map.diff_overall}${mapPlay.od == Map.diff_overall | mapPlay.od === undefined ? '' : '('+ Map.diff_overall + ')'} **CS** ${cs || Map.diff_size}${cs == Map.diff_size | mapPlay.cs === undefined ? '' : '('+ Map.diff_size + ')'} **HP** ${hp || Map.diff_drain}${hp == Map.diff_drain | mapPlay.hp === undefined ? '' : '('+ Map.diff_drain + ')'}`)
        .setThumbnail(`https://s.ppy.sh/a/${player.user_id}`)

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "osutop",
    alias: "ot"
}