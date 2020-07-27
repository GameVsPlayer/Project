const sm = require("string-similarity");
const { exec } = require('child_process');
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
module.exports = {
    autocomplete: async function (message, args) {
        let memberA;

        if (args[0]) {
            if (await message.mentions.users.first() != undefined) {

                let username = message.mentions.users.first();

                memberA = username.id;
            }
            if (!memberA) {

                let members = [];
                let indexes = [];

                let GuildMembers = await message.guild.members.fetch()

                GuildMembers.forEach((member) => {
                    members.push(member.displayName);
                    indexes.push(member.id);
                })

                let match = sm.findBestMatch(args.join(' '), members);

                let username = match.bestMatch.target;

                global.autocomplete = await message.guild.members.fetch(indexes[members.indexOf(username)]);
            }
        } else {
            memberA = message.author;
        }
        memberA = memberA || global.autocomplete || message.author;
        if (!memberA) return message.reply("No user found.").catch((err) => bot.logger.error(err));

        memberA = await message.guild.members.fetch(memberA.userID || memberA);

        return memberA;
    },
    getPrefix: function (bot, guild, callback) {
        db = bot.db.prefixes;
        redis = bot.redis;
        redis.hgetall(guild.id + ".prefix", function (err, reply) {
            if (err) callback(err);
            else if (reply) {
                callback(JSON.parse(reply));
            }
            else {
                db.findOne({
                    guildID: guild.id
                }, function (err, doc) {
                    if (err) callback(err);
                    else if (!doc) {
                        const data = {
                            guildID: message.guild.id,
                            prefix: bot.prefix
                        }
                        db.insertOne(data);
                        redis.set(guild.id +".prefix", bot.prefix, function () {
                            return callback(bot.prefix);
                        });
                    }
                    else {
                        redis.set(guild.id +".prefix", doc.prefix, function () {
                            return callback(doc.prefix);
                    }
                )};

                });
            }
        });
    },
    setPrefix: function (bot, guild, prefix) {
        db = bot.db.prefixes;
        redis = bot.redis;

        db.findOneAndUpdate({
            guildID: guild.id
        }, {
            "$set": {
                prefix: prefix
            }
        });
        redis.set(guild.id +".prefix", prefix, function () {
            return;
        });
    },
    osu: {
        calcPP: async function (bot,bm,playStats, mods, gamemode) {
            let PP = {}
            await new Promise(async (resolve, reject) => {
            let child = exec(`dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} simulate ${gamemode} ${bm} -X ${playStats.misses} -G ${playStats.count100} -M ${playStats.count50} ${mods}-c ${playStats.combo}`, (error, stdout) => {
                if (error) return bot.logger.error(error)
                let stdoutL = stdout.split('\n');
    
                for (info in stdoutL) {
                    stdoutL[info] = stdoutL[info].substring(stdoutL[info].indexOf(":") + 2);
                    stdoutL[info] = stdoutL[info].replace(/(\r\n|\n|\r)/gm, "");
                }      

                PP.combo = stdoutL[2].split(" ")[0];
                PP.accuracy = parseFloat(stdoutL[1]).toFixed(2);
                PP.pp = parseFloat(stdoutL[14]).toFixed(2);   
                PP.ar = parseFloat(stdoutL[12]).toFixed(2);
                PP.od = parseFloat(stdoutL[11]).toFixed(2);
                PP.maxCombo = stdoutL[13];
    
                resolve(PP)
            });
    
        })
        return PP;
        },
        calcMap: async function(bot,bm,dotnet){
            let sr;
            await new Promise(async (resolve, reject) => {
                let child = exec(`dotnet ${path.join(__dirname + "/../PP/PerformanceCalculator.dll")} difficulty ${bm} ${dotnet}`, function (error, stdout) {
                    if (error) return bot.logger.error(error)
                    let stdoutL = stdout.split('\n');
                    sr = stdoutL[5];
                    let win = RegExp('�');
                    let linux = RegExp('');
                    if (win.test(sr)) {
                        sr = sr.split('�')[2];
                        sr = sr.replace(/\ /g, "");
                    } else if (linux.test(sr)) {
                        sr = sr.split('│')[1];
                        sr = sr.replace(/\ /g, "");
                    }
                    parseFloat(sr).toFixed(2);
                    resolve(sr)
                });
        
            })
            return sr;

        },
        userBest: async function(bot,player,gamemode){
            if(gamemode === "osu") gamemode = 0;
            else if(gamemode === "taiko") gamemode = 1;
            else if(gamemode === "ctb") gamemode = 2;
            else if(gamemode === "mania") gamemode = 3;  
            let res = await fetch(`https://osu.ppy.sh/api/get_user_best?u=${player}&k=${bot.config.osuAPI}&m=${gamemode | '0'}`).catch(e => bot.logger.error(e));
            return await res.json();
        },
        player: async function(bot,player,gamemode){
            if(gamemode === "osu") gamemode = 0;
            else if(gamemode === "taiko") gamemode = 1;
            else if(gamemode === "ctb") gamemode = 2;
            else if(gamemode === "mania") gamemode = 3;  
            player = await fetch(`https://osu.ppy.sh/api/get_user?u=${player}&k=${bot.config.osuAPI}&m=${gamemode}`).catch(e => bot.logger.error(e));
            player = await player.json();
            return player[0];

        },
        dlMap: async function(maps,gamemode){
            await new Promise(async function (resolve, reject) {
                if (!fs.existsSync(path.join(__dirname, `/../maps`))) {
                    fs.mkdirSync(path.join(__dirname, `/../maps`))
                }
                if (!fs.existsSync(path.join(__dirname, `/../maps/taiko/`))) {
                    fs.mkdirSync(path.join(__dirname, `/../maps/taiko`))
                }
                if (!fs.existsSync(path.join(__dirname, `/../maps/mania/`))) {
                    fs.mkdirSync(path.join(__dirname, `/../maps/mania`))
                }
                if (!fs.existsSync(path.join(__dirname, `/../maps/ctb/`))) {
                    fs.mkdirSync(path.join(__dirname, `/../maps/ctb`))
                }
                if (!fs.existsSync(path.join(__dirname, `/../maps/osu/`))) {
                    fs.mkdirSync(path.join(__dirname, `/../maps/osu`))
                }
                for (map in maps) {
                    map = maps[map].beatmap_id | maps;
                    if (!fs.existsSync(path.join(__dirname, `/../maps/${gamemode}/${map}.osu`)))
                        await fetch(`https://osu.ppy.sh/${gamemode}/${map}`).then(res => res.text()).then(res => fs.writeFileSync(path.join(__dirname, `/../maps/${gamemode}/${map}.osu`), res, 'utf8'));
                    if (!fs.existsSync(path.join(__dirname, `/../maps/${gamemode}/${map}.osu`)))
                        await fetch(`https://osu.ppy.sh/${gamemode}/${map}`).then(res => res.text()).then(res => fs.writeFileSync(path.join(__dirname, `/../maps/${gamemode}/${map}.osu`), res, 'utf8'));
                }
                setTimeout(() => {
                    resolve()
                }, 500)
        
            });

        },
        enum2Mods: function(num){
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
        calcCSHP: function(Mod,Map) {
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
            return [cs,hp];
        },
        calcBPM: function(Mod,MapBPM) {
            if (Mod.includes("DT") || Mod.includes("NC")) {
                bpm = MapBPM * 1.5;
            } else if (Mod.includes("HT")) {
                bpm = MapBPM / 1.5;
            } else {
                bpm = MapBPM;
            }
            return parseFloat(bpm).toFixed(2);
        },
        mapInfo: async function(bm){
            let Map = {};
            await new Promise(async (resolve, reject) => {
                
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
                    Map.bpm = parseFloat(stdoutL[11]).toFixed(2);
                    Map.divisor = stdoutL[12];
                    resolve(Map)
                });
            })
            return Map;

        }    
    }
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