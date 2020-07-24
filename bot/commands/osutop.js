const Discord = require("discord.js");
const fetch = require("node-fetch");

// Numbers for the calculation of DT/HT AR/OD taken from Zexous AR/OD Calculator https://osu.ppy.sh/community/forums/topics/651535
module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI == "") return bot.logger.info("osu API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    usernameRequst = args.join(" ");
    let Mod, ar, od, cs, hp;
    let score = await fetch(`https://osu.ppy.sh/api/get_user_best?u=${usernameRequst}&k=${bot.config.osuAPI}`);
    apiData = await score.json();

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

    function fetchBeatmap(id, mods) {
        return new Promise(function (resolve, reject) {
            fetch(`https://osu.ppy.sh/api/get_beatmaps?b=${id}&k=${bot.config.osuAPI}&mods=${mods}`).then(res => res.json()).then(json => resolve(json));
        });
    }

    let player = await fetch(`https://osu.ppy.sh/api/get_user?u=${usernameRequst}&k=${bot.config.osuAPI}`);
    player = await player.json();
    player = player[0];

    let Map = await fetchBeatmap(apiData[0].beatmap_id, Mods[1]);

    if (Mod.includes("HR")) {
        let data = calHR(parseFloat(Map[0].diff_approach), parseFloat(Map[0].diff_overall), parseFloat(Map[0].diff_size), parseFloat(Map[0].diff_drain))
        ar = parseFloat(data[0].ar);
        od = parseFloat(data[1].od);
        cs = parseFloat(data[2].cs);
        hp = parseFloat(data[3].hp);
    } else if (Mod.includes("EZ")) {
        let data = calEZ(parseFloat(Map[0].diff_approach), parseFloat(Map[0].diff_overall), parseFloat(Map[0].diff_size), parseFloat(Map[0].diff_drain))
        ar = parseFloat(data[0].ar);
        od = parseFloat(data[1].od);
        cs = parseFloat(data[2].cs);
        hp = parseFloat(data[3].hp);
    } else {
        ar = parseFloat(Map[0].diff_approach);
        od = parseFloat(Map[0].diff_overall);
        cs = parseFloat(Map[0].diff_size);
        hp = parseFloat(Map[0].diff_drain);
    }
    let bpm;
    if (Mod.includes("DT") || Mod.includes("NC")) {
        bpm = Map[0].bpm * 1.5;
        let data = calDT(parseFloat(ar), parseFloat(od));

        ar = parseFloat(data[0].ar);
        od = parseFloat(data[1].od);
    } else if (Mod.includes("HT")) {
        bpm = Map[0].bpm / 1.5;
        let data = calHT(parseFloat(ar), parseFloat(od));
        ar = parseFloat(data[0].ar);
        od = parseFloat(data[1].od);
    } else {
        bpm = Map[0].bpm;
    }

    let divider = (parseInt(apiData[0].count300) * 300) + (parseInt(apiData[0].count100) * 100) + (parseInt(apiData[0].count50) * 50);
    let divisor = (parseInt(apiData[0].count300) + parseInt(apiData[0].count100) + parseInt(apiData[0].count50) + parseInt(apiData[0].countmiss)) * 300;
    let acc = ((divider / divisor) * 100).toFixed(2);


    osuEmbed = new Discord.MessageEmbed()
        .setAuthor(`${player.username}'s Top Play`, `https://b.ppy.sh/thumb/${Map[0].beatmapset_id}.jpg`)
        .setDescription(`${Map[0].title} [${Map[0].version}](https://osu.ppy.sh/b/${Map[0].beatmap_id}) + ${Mod} [${parseFloat(Map[0].difficultyrating).toFixed(2)}★] \n` +
            `${apiData[0].rank} Rank ${acc}% ${apiData[0].pp}PP\n` +
            `Score: ${apiData[0].score}\n` +
            `Combo: ${apiData[0].maxcombo}x/${Map[0].max_combo}x ${apiData[0].count300}/${apiData[0].count100}/${apiData[0].count50}/${apiData[0].countmiss}\n` +
            `Mapper: [${Map[0].creator}](https://osu.ppy.sh/users/${Map[0].creator_id})\n` +
            `BPM: ${bpm}${bpm == Map[0].bpm ? '' : '('+ Map[0].bpm + ')'} \n` +
            `Play set at ${apiData[0].date} ${apiData[0].replay_available === '0' ? 'No replay available' : `Replay available [here](https://osu.ppy.sh/scores/osu/${apiData[0].score_id}/download)`}\n` +
            `**AR** ${ar}${ar == Map[0].diff_approach ? '' : '('+ Map[0].diff_approach + ')'} **OD** ${od}${od == Map[0].diff_overall ? '' : '('+ Map[0].diff_overall + ')'} **CS** ${cs}${cs == Map[0].diff_size ? '' : '('+ Map[0].diff_size + ')'} **HP** ${hp}${hp == Map[0].diff_drain ? '' : '('+ Map[0].diff_drain + ')'}`)
        .setThumbnail(`https://s.ppy.sh/a/${player.user_id}`)
        
    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "osutop",
    alias: "ot"
}



function calARDT(ar) {
    let ms;
    if (ar <= 5) {
        ms = 1800 - 120 * ar;
    } else {
        ms = 1200 - 150 * (ar - 5);
    }
    ms = ms * (2 / 3);
    if (1800 - ms <= 600) {
        ms = (1800 - ms) / 120;
    } else {
        ms = 5 + (1200 - ms) / 150;
    }
    return ms.toFixed(2)
}

function calARHT(ar) {
    let ms;
    if (ar <= 5) {
        ms = 1800 - 120 * ar;
    } else {
        ms = 1200 - 150 * (ar - 5);
    }
    ms = ms * (4 / 3);
    if (1800 - ms <= 600) {
        ms = (1800 - ms) / 120;
    } else {
        ms = 5 + (1200 - ms) / 150;
    }
    return ms.toFixed(2)
}

function calODHT(od) {
    od = 79.5 - od * 6
    od = od * (3/2)
    od = (79.5 - od) / 6
    return od.toFixed(2);
}

function calODDT(od) {
    od = 79.5 - od * 6
    od = od * (2/3)
    od = (79.5 - od) / 6
    return od.toFixed(2);
}

function calEZ(ar, od, cs, hp) {
    let data = []
    if (ar === 0) data.push({
        ar: 0
    });
    else data.push({
        ar: (ar / 2).toFixed(2)
    });
    if (od === 0) data.push({
        od: 0
    });
    else data.push({
        od: (od / 2).toFixed(2)
    });
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

function calHR(ar, od, cs, hp) {
    let data = []
    if (ar === 0) data.push({
        ar: 0
    });
    else if (ar * 1.4 > 10) data.push({
        ar: 10
    });
    else data.push({
        ar: (ar * 1.4).toFixed(2)
    });
    if (od === 0) data.push({
        od: 0
    });
    else if (od * 1.4 > 10) data.push({
        od: 10
    });
    else data.push({
        od: (od * 1.4).toFixed(2)
    });
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

function calHT(ar, od) {
    let data = []
    if (ar === 0) data.push({
        ar: 0
    });
    else data.push({
        ar: calARHT(ar)
    });
    if (arod === 0) data.push({
        od: 0
    });
    else data.push({
        od: calODHT(od)
    });
    return data;
}

function calDT(ar, od) {
    let data = []
    if (ar === 0) data.push({
        ar: 0
    });
    else data.push({
        ar: calARDT(ar)
    });
    if (od === 0) data.push({
        od: 0
    });
    else data.push({
        od: calODDT(od)
    });
    return data;
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