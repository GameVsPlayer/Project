import * as sm from "string-similarity";
import {
    exec
} from 'child_process';
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import {
    User,
    Guild,
    Message
} from "discord.js";


module.exports = {
    autocomplete: async function (bot: any, message: Message, args: string[]) {
        let memberA: any;

        if (args[0]) {
            if (message.mentions.users.first() != undefined) {

                let username: User = message.mentions.users.first();

                memberA = username.id;
            }
            if (!memberA) {

                let members: any = [];
                let indexes: any = [];

                let GuildMembers = await message.guild.members.fetch()

                GuildMembers.forEach((member: any) => {
                    members.push(member.displayName);
                    indexes.push(member.id);
                })

                let match = sm.findBestMatch(args.join(' '), members);

                let username = match.bestMatch.target;

                memberA = await message.guild.members.fetch(indexes[members.indexOf(username)]);
            }
        } else {
            memberA = message.author;
        }
        memberA = memberA || message.author;
        if (!memberA) return message.reply("No user found.").catch((err: Error) => bot.logger.error(err));

        memberA = await message.guild.members.fetch(memberA.userID || memberA);

        return memberA;
    },

    getPrefix: function (bot: any, guild: Guild, callback: Function) {
        let db: any = bot.db.prefixes;
        let redis: any = bot.redis;
        redis.get(guild.id + ".prefix", function (err: Error, reply: string) {
            if (err) callback(err);
            else if (reply) {
                callback(reply);
            } else {
                db.findOne({
                    guildID: guild.id
                }, function (err: Error, doc: any) {
                    if (err) callback(err);
                    else if (!doc) {
                        const data = {
                            guildID: guild.id,
                            prefix: bot.prefix
                        }
                        db.insertOne(data);
                        redis.set(guild.id + ".prefix", bot.prefix, function () {
                            return callback(bot.prefix);
                        });
                    } else {
                        redis.set(guild.id + ".prefix", doc.prefix, function () {
                            return callback(doc.prefix);
                        })
                    };

                });
            }
        });
    },
    setPrefix: function (bot: any, guild: Guild, prefix: string) {
        let db: any = bot.db.prefixes;
        let redis: any = bot.redis;

        db.findOneAndUpdate({
            guildID: guild.id
        }, {
            "$set": {
                prefix: prefix
            }
        });
        redis.set(guild.id + ".prefix", prefix, function () {
            return;
        });
    },
    osu: {
        calcPP: async function (bot: any, bm: string, playStats: any, mods: string, gamemode: string) {
            try {
                let PP: any = {};
                await new Promise(async (resolve) => {
                    let cmd: string;
                    if (bot !== null && !fs.existsSync(bm)) {
                        let map: any = bm;

                        map = map.replace(/.osu/gm, '')

                        map = map.split("\\")

                        map = {
                            beatmap_id: map[map.length - 1]
                        }

                        await bot.extra.osu.dlMap({ map })

                    }

                    function calcAcc(perfect: number, good: number, mehs: number, misses: number) {

                        let a = ((mehs * 50) + (good * 100) + (perfect * 300));
                        let b = 300 * (misses * 1 + good * 1 + mehs * 1 + perfect * 1)

                        return (a / b) * 100

                    }
                    if (gamemode === "osu") cmd = `dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate ${gamemode} ${bm} -a ${calcAcc(playStats.count300, playStats.count100, playStats.count50, playStats.misses)} ${mods}-c ${playStats.combo}`;
                    else if (gamemode === "mania") cmd = `dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate ${gamemode} ${bm} ${mods}-s ${playStats.score}`;
                    else if (gamemode === "catch") cmd = `dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate ${gamemode} ${bm} -X ${playStats.misses} -D ${playStats.count300} -T ${parseInt(playStats.count100) + parseInt(playStats.count50)} ${mods}-c ${playStats.combo}`;
                    else if (gamemode === "taiko") cmd = `dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate ${gamemode} ${bm} -X ${playStats.misses} -G ${playStats.count300} ${mods}-c ${playStats.combo}`
                    else cmd = `dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate ${gamemode} ${bm} -a ${calcAcc(playStats.count300, playStats.count100, playStats.count50, playStats.misses)} ${mods}-c ${playStats.combo}`;
                    //console.log(cmd);
                    exec(cmd, (error, stdout) => {
                        if (error && bot !== null) return bot.logger.error(error)
                        else if (error) return console.error(error);
                        let stdoutL = stdout.split('\n');

                        for (let info in stdoutL) {
                            stdoutL[info] = stdoutL[info].substring(stdoutL[info].indexOf(":"));
                            stdoutL[info] = stdoutL[info].replace(/(\r\n|\n|\r)/gm, "");
                            stdoutL[info] = stdoutL[info].replace(/: /gm, "");
                        }

                        if (stdoutL.length < 5 && bot !== null) return bot.logger.error(`${cmd} \n ${stdoutL}`)
                        else if (stdoutL.length < 5) return console.error(`${cmd} \n ${stdoutL}`)

                        if (gamemode === "osu") {
                            PP = {
                                combo: stdoutL[2].split("(")[0],
                                accuracy: parseFloat(stdoutL[1]).toFixed(2),
                                pp: parseFloat(stdoutL[14]).toFixed(2),
                                ar: parseFloat(stdoutL[12]).toFixed(2),
                                od: parseFloat(stdoutL[11]).toFixed(2),
                                maxCombo: stdoutL[13]
                            }
                        } else if (gamemode === "mania") {
                            {
                                PP = {
                                    pp: parseFloat(stdoutL[5]).toFixed(2)
                                };
                            }
                        } else if (gamemode === "catch") {
                            {
                                PP = {
                                    pp: parseFloat(stdoutL[9]).toFixed(2),
                                    ar: parseFloat(stdoutL[1]).toFixed(2),
                                    combo: stdoutL[2]
                                };
                            }
                        } else if (gamemode === "taiko") {
                            {
                                PP = {
                                    accuracy: parseFloat(stdoutL[1]).toFixed(2),
                                    pp: parseFloat(stdoutL[9]).toFixed(2),
                                    combo: stdoutL[2]
                                }
                            }
                        }
                        resolve(PP)
                    });

                })
                return PP;
            } catch {
                (e: Error) => { console.error(e) }

            }
        },
        calcMap: async function (bot: any, bm: string, dotnet: string, gamemode: any) {
            try {
                let sr: any, maxcombo: any, ar: any;
                if (gamemode === "osu") gamemode = 0;
                else if (gamemode === "taiko") gamemode = 1;
                else if (gamemode === "catch") gamemode = 2;
                else if (gamemode === "mania") gamemode = 3;
                else gamemode = 0;
                await new Promise(async (resolve) => {
                    exec(`dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} difficulty ${bm} ${dotnet} -r=${gamemode}`, function (error, stdout) {
                        if (error && bot !== null) return bot.logger.error(error)
                        else if (error) return console.error(error);
                        let stdoutL: any = stdout.split('\n');
                        sr = stdoutL[5];
                        sr = sr.split("     ");
                        for (let i in sr) {
                            sr[i] = sr[i].substring(0, sr[i].length - 1)
                            sr[i] = sr[i].replace(/ /gm, '')
                            sr[i] = sr[i].replace(/:/gi, '')
                        }
                        let maxcombo = sr[4];
                        let ar = sr[5];
                        sr = sr[1];
                        let od = sr[5];
                        parseFloat(sr).toFixed(2);
                        return resolve([sr, maxcombo, ar, od]);
                    });

                })
                return [sr, maxcombo, ar];
            } catch {
                (e: Error) => {
                    console.error(e);
                    return console.log(`dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} difficulty ${bm} ${dotnet} -r=${gamemode}`)
                }
            }
            return null;

        },
        userBest: async function (bot: any, player: string, gamemode: any) {
            if (gamemode === "osu") gamemode = 0;
            else if (gamemode === "taiko") gamemode = 1;
            else if (gamemode === "catch") gamemode = 2;
            else if (gamemode === "mania") gamemode = 3;
            else gamemode = 0;
            let res = await fetch(`https://osu.ppy.sh/api/get_user_best?u=${player}&k=${bot.config.osuAPI}&m=${gamemode}`).catch((e: Error) => bot.logger.error(e));
            res = await res.json();
            return res;
        },
        player: async function (bot: any, player: any, gamemode: any) {
            if (gamemode === "osu") gamemode = 0;
            else if (gamemode === "taiko") gamemode = 1;
            else if (gamemode === "catch") gamemode = 2;
            else if (gamemode === "mania") gamemode = 3;
            else gamemode = 0;
            player = await fetch(`https://osu.ppy.sh/api/get_user?u=${player}&k=${bot.config.osuAPI}&m=${gamemode}`).catch((e: Error) => bot.logger.error(e));
            player = await player.json();
            return player[0];

        },
        dlMap: async function (maps: any) {
            try {
                await new Promise(async function (resolve) {
                    if (!fs.existsSync(path.join(__dirname, `/../maps`))) {
                        fs.mkdirSync(path.join(__dirname, `/../maps`))
                    }
                    for (let curMap in maps) {
                        let map = maps[curMap].beatmap_id;
                        if (!fs.existsSync(path.join(__dirname, `/../maps/${map}.osu`)))
                            await fetch(`https://osu.ppy.sh/osu/${map}`).then((res: any) => res.text()).then((res: any) => fs.writeFileSync(path.join(__dirname, `/../maps/${map}.osu`), res, 'utf8'));
                        if (!fs.existsSync(path.join(__dirname, `/../maps/${map}.osu`)))
                            await fetch(`https://osu.ppy.sh/osu/${map}`).then((res: any) => res.text()).then((res: any) => fs.writeFileSync(path.join(__dirname, `/../maps/${map}.osu`), res, 'utf8'));
                    }
                    resolve();


                });
            } catch {

            }

        },
        enum2Mods: function (num: any) {
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

        },
        calcCSHP: function (Mod: string, Map: any) {
            let cs, hp: any;
            if (Mod.includes("HR")) {
                let data: any = calHR(parseFloat(Map.diff_size), parseFloat(Map.diff_drain))
                cs = parseFloat(data[0].cs);
                hp = parseFloat(data[1].hp);
            } else if (Mod.includes("EZ")) {
                let data: any = calEZ(parseFloat(Map.diff_size), parseFloat(Map.diff_drain))
                cs = parseFloat(data[0].cs);
                hp = parseFloat(data[1].hp);
            } else {
                cs = parseFloat(Map.diff_size);
                hp = parseFloat(Map.diff_drain);
            }
            return [cs, hp];
        },
        calcBPM: function (Mod: string, MapBPM: any) {
            let bpm: any;
            if (Mod.includes("DT") || Mod.includes("NC")) {
                bpm = parseFloat(MapBPM) * 1.5;
            } else if (Mod.includes("HT")) {
                bpm = parseFloat(MapBPM) / 1.5;
            } else {
                bpm = MapBPM;
            }
            return parseFloat(bpm).toFixed(2);
        },
        mapInfo: async function (bot: any, bm: string) {
            let Map: any = {};
            await new Promise(async (resolve) => {

                exec(`dotnet ${path.join(__dirname + "/../PP/MapInfo.dll")} ${bm}`, (error, stdout) => {
                    if (error) return bot.logger.error(error)
                    let stdoutL = stdout.split('\n');

                    for (let info in stdoutL) {
                        stdoutL[info] = stdoutL[info].substring(stdoutL[info].indexOf(" ") + 1)
                        stdoutL[info] = stdoutL[info].replace(/(\r\n|\n|\r)/gm, "");
                    }
                    Map = {
                        diff_size: stdoutL[1],
                        diff_drain: stdoutL[2],
                        diff_approach: stdoutL[3],
                        diff_overall: stdoutL[4],
                        beatmap_id: stdoutL[5],
                        beatmapset_id: stdoutL[6],
                        title: stdoutL[7],
                        creator: stdoutL[8],
                        artist: stdoutL[9],
                        version: stdoutL[10],
                        bpm: parseFloat(stdoutL[11]).toFixed(2),
                        divisor: stdoutL[12]
                    };
                    resolve(Map)
                });
            })
            return Map;

        },
        recent: async function (bot: any, user: string, gamemode: any, attempt: any) {
            try {
                if (!attempt) attempt = 0;
                else if (attempt === 0) attempt = 0;
                else attempt = parseInt(attempt) - 1;
                if (gamemode === "osu") gamemode = 0;
                else if (gamemode === "taiko") gamemode = 1;
                else if (gamemode === "catch") gamemode = 2;
                else if (gamemode === "mania") gamemode = 3;
                else gamemode = "osu";
                let res = await fetch(`https://osu.ppy.sh/api/get_user_recent?u=${user}&k=${bot.config.osuAPI}&m=${gamemode}`).catch((e: Error) => bot.logger.error(e));
                res = await res.json();
                if (!res[0]) return "no plays";
                let tryC = 0;
                let lastID = res[attempt].beatmap_id;
                for (let i in res) {
                    let n: number = parseInt(i) + parseInt(attempt);
                    if (!res[n]) break
                    if (res[n].beatmap_id === lastID) tryC++;
                    else continue;
                }
                let play = res;
                play.try = tryC;
                return play;
            } catch { }
        },
        getDbUser: function (bot: any, message: Message, callback: any) {
            let db: any = bot.db.osuName;
            let redis: any = bot.redis;
            redis.get(message.author.id + ".osuname", function (err: Error, reply: any) {
                if (err) return callback(err);
                else if (reply) {
                    callback(JSON.parse(reply));
                } else {
                    db.findOne({
                        userID: message.author.id
                    }, function (err: Error, doc: any) {
                        if (err) callback(err);
                        else if (!doc) return callback(null);
                        else {
                            redis.set(message.author.id + ".osuname", JSON.stringify({
                                userID: doc.userID,
                                gameID: doc.gameID,
                                gamemode: doc.gamemode
                            }), function () {
                                return callback({
                                    gameID: doc.gameID,
                                    gamemode: doc.gamemode
                                });
                            })
                        };

                    });
                }
            });
        },
        setUser: async function (bot: any, message: Message, gameID: any, gamemode: any) {

            let db: any = bot.db.osuName;
            let redis: any = bot.redis;
            let user;

            user = await db.findOne({
                userID: message.author.id
            })
            if (user !== null) {
                await db.findOneAndUpdate({
                    userID: message.author.id
                }, {
                    "$set": {
                        gameID: gameID,
                        gamemode: gamemode
                    }
                });
            } else {
                let data = {
                    userID: message.author.id,
                    gameID: gameID,
                    gamemode: gamemode
                }
                await db.insertOne(data);
            }
            redis.set(message.author.id + ".osuname", JSON.stringify({
                userID: message.author.id,
                gameID: gameID,
                gamemode: gamemode
            }), function () {
                return;
            });
        }
    }
}

function calEZ(cs: any, hp: any) {
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

function calHR(cs: any, hp: any) {
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