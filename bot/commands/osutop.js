const Discord = require("discord.js");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const {
    exec
} = require('child_process');


// Numbers for the calculation of DT/HT AR/OD taken from Zexous AR/OD Calculator https://osu.ppy.sh/community/forums/topics/651535
module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("osu API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    usernameRequst = args.join(" ");
    let Mod, cs, hp;

    let score = await fetch(`https://osu.ppy.sh/api/get_user_best?u=${usernameRequst}&k=${bot.config.osuAPI}`).catch(e => bot.logger.error(e));
    apiData = await score.json();
    if (!fs.existsSync(path.join(__dirname, `/../maps`))) {
        fs.mkdirSync(path.join(__dirname, `/../maps`))
    }

    for (map in apiData) {
        await new Promise(function (resolve, reject) {
            map = apiData[map].beatmap_id;
            if (!fs.existsSync(path.join(__dirname, `/../maps/${map}.osu`))) {
                fetch(`https://osu.ppy.sh/osu/${map}`).then(res => res.text()).then(res => fs.writeFileSync(path.join(__dirname, `/../maps/${map}.osu`), res, 'utf8'));
                resolve();
            } else {
                resolve()
            }
        })
    }
    let bm = path.join(__dirname, `/../maps/${apiData[0].beatmap_id}.osu`);
    let Map = {};
    await new Promise((resolve, reject) => {
        let child = exec(`dotnet ${path.join(__dirname + "/../PP/MapInfo.dll")} ${bm}`, (error, stdout) => {
            if (error) return bot.logger.error(error)
            let stdoutL = stdout.split('\n');

            for (info in stdoutL) {
                stdoutL[info] = stdoutL[info].substring(stdoutL[info].indexOf(" ") + 1)
                stdoutL[info] = stdoutL[info].replace(/(\r\n|\n|\r)/gm, "");
            }
            Map.diff_size = stdoutL[1];
            Map.diff_drain = stdoutL[2];
            Map.diff_approach = stdoutL[3];
            Map.diff_overall = stdoutL[4];
            Map.beatmap_id = stdoutL[5];
            Map.beatmapset_id = stdoutL[6];
            Map.title = stdoutL[7];
            Map.creator = stdoutL[8];
            Map.artist = stdoutL[9];
            Map.version = stdoutL[10];
            Map.bpm = stdoutL[11];
            Map.divisor = stdoutL[12];
            resolve()
        });

    })

    function numToMod(num) {
        if (num === null) return ['', 0];
        let number = parseInt(num)
        let mod_list = []
        let diffMods = 0;


        if (number & 1 << 0) mod_list.push('NF')
        if (number & 1 << 1) {
            mod_list.push('EZ')
            diffMods = diffMods + (1 << 1);
        }
        if (number & 1 << 3) mod_list.push('HD')
        if (number & 1 << 4) {
            mod_list.push('HR')
            diffMods = diffMods + (1 << 4);
        }
        if (number & 1 << 5) mod_list.push('SD')
        if (number & 1 << 9) {
            mod_list.push('NC')
            diffMods = diffMods + (1 << 6);
        } else if (number & 1 << 6) {
            mod_list.push('DT')
            diffMods = diffMods + (1 << 6);
        }
        if (number & 1 << 7) mod_list.push('RX')
        if (number & 1 << 8) {
            mod_list.push('HT')
            diffMods = diffMods + 1 << 8;
        }
        if (number & 1 << 10) mod_list.push('FL')
        if (number & 1 << 12) mod_list.push('SO')
        if (number & 1 << 14) mod_list.push('PF')
        if (number & 1 << 15) mod_list.push('4 KEY')
        if (number & 1 << 16) mod_list.push('5 KEY')
        if (number & 1 << 17) mod_list.push('6 KEY')
        if (number & 1 << 18) mod_list.push('7 KEY')
        if (number & 1 << 19) mod_list.push('8 KEY')
        if (number & 1 << 20) mod_list.push('FI')
        if (number & 1 << 24) mod_list.push('9 KEY')
        if (number & 1 << 25) mod_list.push('10 KEY')
        if (number & 1 << 26) mod_list.push('1 KEY')
        if (number & 1 << 27) mod_list.push('3 KEY')
        if (number & 1 << 28) mod_list.push('2 KEY')
        return [mod_list, diffMods];
    }
    let Mods = numToMod(apiData[0].enabled_mods);
    Mod = Mods[0].join(", ");

    let player = await fetch(`https://osu.ppy.sh/api/get_user?u=${usernameRequst}&k=${bot.config.osuAPI}`).catch(e => bot.logger.errro(e));
    player = await player.json();
    player = player[0];

    if (Mod.includes("HR")) {
        let data = calHR(parseFloat(Map.diff_size), parseFloat(Map.diff_drain))
        cs = parseFloat(data[0].cs);
        hp = parseFloat(data[1].hp);
    } else if (Mod.includes("EZ")) {
        let data = calEZ(parseFloat(Map.diff_size), parseFloat(Map.diff_drain))
        cs = parseFloat(data[0].cs);
        hp = parseFloat(data[1].hp);
    } else {
        cs = parseFloat(Map.diff_size);
        hp = parseFloat(Map.diff_drain);
    }

    let bpm;
    if (Mod.includes("DT") || Mod.includes("NC")) {
        bpm = Map.bpm * 1.5;
    } else if (Mod.includes("HT")) {
        bpm = Map.bpm / 1.5;
    } else {
        bpm = Map.bpm;
    }

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
        combo: apiData[0].maxcombo,
        misses: apiData[0].countmiss,
        count100: apiData[0].count100,
        count300: apiData[0].count300,
        count50: apiData[0].count50
    }
    let pp;
    let mapPlay;
    await new Promise((resolve, reject) => {
        let child = exec(`dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate osu ${bm} -X ${playStats.misses} -G ${playStats.count100} -M ${playStats.count50} ${dotnet}-c ${playStats.combo}`, (error, stdout) => {
            if (error) return bot.logger.error(error)
            let stdoutL = stdout.split('\n');

            for (info in stdoutL) {
                stdoutL[info] = stdoutL[info].substring(stdoutL[info].indexOf(":") + 2);
                stdoutL[info] = stdoutL[info].replace(/(\r\n|\n|\r)/gm, "");
            }
            mapPlay = stdoutL;
            console.log(mapPlay);
            mapPlay[2] = mapPlay[2].split(" ")[0];
            mapPlay[14] = parseFloat(mapPlay[14]).toFixed(2);
            mapPlay[1] = parseFloat(mapPlay[1]).toFixed(2);
            mapPlay[11] = parseFloat(mapPlay[1]).toFixed(2);

            resolve()
        });

    })

    osuEmbed = new Discord.MessageEmbed()
        .setAuthor(`${player.username}'s Top Play`, `https://b.ppy.sh/thumb/${Map.beatmapset_id}.jpg`)
        .setDescription(`${Map.title} [${Map.version}](https://osu.ppy.sh/b/${Map.beatmap_id}) + ${Mod} [${parseFloat(Map.difficultyrating).toFixed(2)}★] \n` +
            `${apiData[0].rank} Rank ${mapPlay[1]}% ${mapPlay[14]}PP\n` +
            `Score: ${apiData[0].score}\n` +
            `Combo: ${mapPlay[2]}x/${mapPlay[13]}x ${apiData[0].count300}/${apiData[0].count100}/${apiData[0].count50}/${apiData[0].countmiss}\n` +
            `Mapper: ${Map.creator}\n` +
            `BPM: ${bpm}${bpm == Map.bpm ? '' : '('+ Map.bpm + ')'} Divisor 1/${Map.divisor}\n` +
            `Play set at ${apiData[0].date} ${apiData[0].replay_available === '0' ? 'No replay available' : `Replay available [here](https://osu.ppy.sh/scores/osu/${apiData[0].score_id}/download)`}\n` +
            `**AR** ${mapPlay[12]}${mapPlay[12] == Map.diff_approach ? '' : '('+ Map.diff_approach + ')'} **OD** ${mapPlay[11]}${mapPlay[11] == Map.diff_overall ? '' : '('+ Map.diff_overall + ')'} **CS** ${cs}${cs == Map.diff_size ? '' : '('+ Map.diff_size + ')'} **HP** ${hp}${hp == Map.diff_drain ? '' : '('+ Map.diff_drain + ')'}`)
        .setThumbnail(`https://s.ppy.sh/a/${player.user_id}`)

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "osutop",
    alias: "ot"
}

function calEZ(cs, hp) {
    let data = []
    if (cs === 0) data.push({
        cs: 0
    });
    else data.push({
        cs: (cs / 2).toFixed(2)
    });
    if (hp === 0) data.push({
        hp: 0
    });
    else data.push({
        hp: (hp / 2).toFixed(2)
    });
    return data;
}

function calHR(cs, hp) {
    let data = []
    if (cs === 0) data.push({
        cs: 0
    });
    else if (cs * 1.3 > 10) data.push({
        cs: 10
    });
    else data.push({
        cs: (cs * 1.3).toFixed(2)
    });
    if (hp === 0) data.push({
        hp: 0
    });
    else if (hp * 1.4 > 10) data.push({
        hp: 10
    });
    else data.push({
        hp: (hp * 1.4).toFixed(2)
    });
    return data;
}

function mode(array) {
    if (array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0],
        maxCount = 1;
    for (var i = 0; i < array.length; i++) {
        var el = array[i];
        if (modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}
// let apiData = [{
//     beatmap_id: '129891',
//     score_id: '2177560145',
//     score: '132408001',
//     maxcombo: '2385',
//     count50: '0',
//     count100: '5',
//     count300: '1978',
//     countmiss: '0',
//     countkatu: '4',
//     countgeki: '247',
//     perfect: '1',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2016-09-20 01:51:49',
//     rank: 'SH',
//     pp: '894.388',
//     replay_available: '1'
// },
// {
//     beatmap_id: '555797',
//     score_id: '2907744550',
//     score: '67890313',
//     maxcombo: '1613',
//     count50: '0',
//     count100: '25',
//     count300: '1564',
//     countmiss: '1',
//     countkatu: '16',
//     countgeki: '279',
//     perfect: '0',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2019-10-03 19:46:32',
//     rank: 'A',
//     pp: '830.861',
//     replay_available: '1'
// },
// {
//     beatmap_id: '774965',
//     score_id: '2275021419',
//     score: '72389038',
//     maxcombo: '1773',
//     count50: '0',
//     count100: '8',
//     count300: '1165',
//     countmiss: '0',
//     countkatu: '7',
//     countgeki: '254',
//     perfect: '0',
//     enabled_mods: '72',
//     user_id: '124493',
//     date: '2017-03-30 01:19:11',
//     rank: 'SH',
//     pp: '812.571',
//     replay_available: '1'
// },
// {
//     beatmap_id: '795627',
//     score_id: '2289753635',
//     score: '45349601',
//     maxcombo: '1326',
//     count50: '3',
//     count100: '59',
//     count300: '936',
//     countmiss: '0',
//     countkatu: '33',
//     countgeki: '192',
//     perfect: '0',
//     enabled_mods: '72',
//     user_id: '124493',
//     date: '2017-04-25 03:56:59',
//     rank: 'SH',
//     pp: '799.973',
//     replay_available: '1'
// },
// {
//     beatmap_id: '658127',
//     score_id: '2283307549',
//     score: '159993889',
//     maxcombo: '2364',
//     count50: '0',
//     count100: '24',
//     count300: '1947',
//     countmiss: '2',
//     countkatu: '14',
//     countgeki: '214',
//     perfect: '0',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2017-04-13 23:55:30',
//     rank: 'A',
//     pp: '781.747',
//     replay_available: '1'
// },
// {
//     beatmap_id: '1402392',
//     score_id: '2443716244',
//     score: '81749413',
//     maxcombo: '1709',
//     count50: '0',
//     count100: '0',
//     count300: '1394',
//     countmiss: '0',
//     countkatu: '0',
//     countgeki: '318',
//     perfect: '1',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2018-01-11 02:24:54',
//     rank: 'XH',
//     pp: '764.598',
//     replay_available: '1'
// },
// {
//     beatmap_id: '1432943',
//     score_id: '2978253645',
//     score: '98169217',
//     maxcombo: '2336',
//     count50: '0',
//     count100: '15',
//     count300: '1669',
//     countmiss: '0',
//     countkatu: '10',
//     countgeki: '212',
//     perfect: '0',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2020-01-09 18:34:15',
//     rank: 'SH',
//     pp: '764.335',
//     replay_available: '1'
// },
// {
//     beatmap_id: '791274',
//     score_id: '2242342596',
//     score: '217670160',
//     maxcombo: '2911',
//     count50: '0',
//     count100: '4',
//     count300: '2209',
//     countmiss: '0',
//     countkatu: '3',
//     countgeki: '290',
//     perfect: '1',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2017-01-31 02:35:02',
//     rank: 'SH',
//     pp: '761.988',
//     replay_available: '1'
// },
// {
//     beatmap_id: '970048',
//     score_id: '2135320568',
//     score: '57211961',
//     maxcombo: '1466',
//     count50: '0',
//     count100: '7',
//     count300: '1142',
//     countmiss: '0',
//     countkatu: '7',
//     countgeki: '203',
//     perfect: '1',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2016-06-25 14:58:40',
//     rank: 'SH',
//     pp: '754.852',
//     replay_available: '1'
// },
// {
//     beatmap_id: '718156',
//     score_id: '2246847521',
//     score: '210939093',
//     maxcombo: '2811',
//     count50: '0',
//     count100: '45',
//     count300: '2162',
//     countmiss: '0',
//     countkatu: '30',
//     countgeki: '455',
//     perfect: '1',
//     enabled_mods: '24',
//     user_id: '124493',
//     date: '2017-02-08 01:33:27',
//     rank: 'SH',
//     pp: '744.442',
//     replay_available: '1'
// }
// ]