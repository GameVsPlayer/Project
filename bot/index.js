const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '/.env')
});
var AdmZip = require('adm-zip');
const logger = require('./logger');
const request = require("request");
const botconfig = process.env;
const Discord = require("discord.js");
const moment = require("moment-timezone");
const fs = require('fs');
const osutils = require("os-utils");
const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://GamuKaren:${botconfig.mongodb}@karenbotgamu-o1gvd.azure.mongodb.net/test?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const redis = require('redis');

let dbLoad = false;
if (!fs.existsSync(path.join(__dirname, `/temp/`))) {
    fs.mkdirSync(path.join(__dirname, `/temp/`));
}
if (!fs.existsSync(path.join(__dirname, `/temp/Calculator.zip`))) {
    console.log("Download for PP Calculator Started!");
    let file = fs.createWriteStream(path.join(__dirname, `/temp/Calculator.zip`));
    const start = new Date();
    new Promise((resolve, reject) => {
        let stream = request({
                uri: "https://www.dropbox.com/s/9is9es6szcxvcm0/Calculator.zip?dl=1"
            }).pipe(file)
            .on('finish', () => {
                console.log(`Downloaded PP Calculator in ${(new Date() - start) / 1000} Seconds`);
                file.emit('close');
                if (!fs.existsSync(path.join(__dirname, `/PP`))) {
                    fs.mkdirSync(path.join(__dirname, `/PP/`));
                }
                if (!fs.existsSync(path.join(__dirname, `/PP/PerformanceCalculator.dll`))) {
                    console.log("Extraction Start!");
                    new Promise((resolve, reject) => {
                        const start2 = new Date();
                        let zip = new AdmZip(path.join(__dirname, `/temp/Calculator.zip`));
                        zip.extractAllTo(path.join(__dirname, `/PP`));
                        resolve();
                        console.log(`Extraction complete in ${(new Date() - start2) / 1000} Seconds!`);
                    })
                };
                resolve();
            })
            .on('error', (error) => {
                reject(error)
            })
    });

};



mongoClient.connect(async (err) => {
    if (err) bot.logger.error(err);

    bot.logger.info(`Connected to database`);

    let availableCollections = [];
    bot.db = mongoClient.db("datastorage");

    bot.db.hugsDB = await bot.db.collection("hugs");
    bot.db.patsDB = await bot.db.collection("pats");
    bot.db.kissDB = await bot.db.collection("kiss");
    bot.db.xpDB = await bot.db.collection("xp");
    bot.db.moneyDB = await bot.db.collection("money");
    bot.db.todoDB = await bot.db.collection("todo");
    bot.db.prefixes = await bot.db.collection("prefix");
    bot.db.osuName = await bot.db.collection("osuName");
    dbLoad = true;
});


const bot = new Discord.Client({
    disableEveryone: true
});

bot.commands = new Discord.Collection;
bot.website = new Discord.Collection;
bot.activities = new Discord.Collection;
bot.events = new Discord.Collection;
bot.youtube = new Discord.Collection;
bot.stats = new Discord.Collection;
bot.mutes = require("./datastorage/mutes.json");
bot.blackListedGuilds = require("./datastorage/blackListedGuilds.json");
bot.blackListedUsers = require("./datastorage/blackListedUsers.json");
bot.logger = logger;
var loggedIN = 0;
const YouTube = require("simple-youtube-api");

require('events').EventEmitter.defaultMaxListeners = 20;
bot.extra = require('./externalLoading/extra');
bot.config = botconfig;

bot.youtube = new YouTube(bot.config.googleAPI);
bot.redis = redis.createClient();

bot.redis.on('connect', () => {
    bot.logger.info("Connected to redis database!");
})

/*bot.on("shardReconnecting", , id => console.log(`Shard with ID ${id} reconnected.`));*/
bot.redis.on("error", function (error) {
    bot.logger.error(error);
});

setInterval(() => {
    let duration = moment.duration(bot.uptime)
    bot.duration = {
        days: duration.days(),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds()
    }
    bot.fullUptime = `${bot.duration.days}D/${bot.duration.hours}H:${bot.duration.minutes}M:${bot.duration.seconds}S`;
    bot.usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0) + "MB";
}, 1000);

bot.on("ready", async () => {
    loggedIN = 1;
    setInterval(() => {
        osutils.cpuUsage(v => {


            bot.stats.usage = {
                cores: osutils.cpuCount(),
                cpuUsage: (v * 100).toFixed(0) + "%",
                avgLoad: osutils.loadavg(5),
                platform: osutils.platform()
            }
        })
    }, 1000);
    bot.serverList = bot.guilds.cache.map(g => {
        return {
            Name: g.name,
            MemberCount: g.memberCount,
            Owner: g.owner.user.username
        };
    });

    bot.serverList.sort((a, b) => b.MemberCount - a.MemberCount);

    ////////////////

    reloadEvents();
    /////////

    bot.logger.info(`${bot.user.username} is online!`);

    if (dbLoad === false) await sleep(5000);
    i = 0;

    await bot.db.xpDB.find({
        messageCount: 1
    }).forEach(async (x) => {
        await bot.db.xpDB.deleteOne({
            "_id": x._id,
        })
    });

    bot.indexActivity = 1;
    var curActivity = 1;
    let notification = false;

    setInterval(async () => {
        //97947067
        //
        try {
            let fet = await fetch('https://decapi.me/twitch/uptime/gamevsplayer', {
                timeout: 5000
            })
            if (!fet) {
                notification = false;
                return activityLoop();
            }

            fet = await fet.text().catch()
            if (fet.includes('offline')) {
                notification = false;
                return activityLoop();
            }
        } catch (error) {
            bot.logger.error(error);
        };


        let twitchStatus = await fetch(`https://api.twitch.tv/helix/streams?user_id=97947067`, {
            method: 'GET',
            headers: {
                "Client-ID": bot.config.TwitchID,
                "Authorization": `Bearer ${bot.config.TwitchAuth}`
            },
            timeout: 5000

        }).catch((err) => bot.logger.error(err));
        twitchStatus = await twitchStatus.json();

        if (twitchStatus.data === undefined) {
            notification = false;
            return activityLoop();
        }

        if (twitchStatus.data[0] !== undefined) {
            if (twitchStatus.data[0].type === 'live') {
                let twitchGame = await fetch(`https://api.twitch.tv/helix/games?id=${twitchStatus.data[0].game_id}`, {
                    method: 'GET',
                    headers: {
                        "Client-ID": bot.config.TwitchID,
                        "Authorization": `Bearer ${bot.config.TwitchAuth}`
                    },
                    timeout: 5000
                }, );
                twitchGame = await twitchGame.json();
                bot.user.setActivity(`${twitchGame.data[0].name} on Twitch!`, {
                    url: `https://twitch.tv/${twitchStatus.data[0].user_name}`,
                    type: 'STREAMING'
                }).catch(err => bot.logger.error(err));
                if (notification === false) {

                    let messageChannel = await bot.channels.get("154338003207061504");
                    let pingRole = await messageChannel.guild.roles.cache.get("426742035761070091");
                    await pingRole.setMentionable(true);

                    let pingEmbed = new Discord.MessageEmbed()
                        .setTitle("Now Streaming")
                        .setURL(`https://gamu.tk/twitch`)
                        .setColor(bot.config.color)
                        .addField("Title", twitchStatus.data[0].title)
                        .addField("Game", twitchGame.data[0].name)
                        .setThumbnail(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${(twitchStatus.data[0].user_name).toLowerCase()}-1920x1080.jpg`);
                    await messageChannel.send(`<@&${pingRole.id}>`).catch(e => messageChannel.send(e));
                    await pingRole.setMentionable(false);
                    messageChannel.send(pingEmbed).catch((e) => messageChannel.send(e));
                    notification = true;
                }
            } else {
                notification = false;
                return activityLoop();

            };
        } else {
            notification = false;
            return activityLoop();

        };

    }, 60000);

    function activityLoop() {
        if (bot.indexActivity === 0) {
            bot.user.setActivity(`MAINTENANCE`, {
                type: "PLAYING"
            }).catch();

            return;
        } else if (bot.indexActivity === 1) {
            let activityAmount = (bot.activities).size;
            if (curActivity > activityAmount) curActivity = 1;
            let activity = bot.activities.get(curActivity);
            if (activity) activity.run(bot).catch((error) => bot.logger.error(error));
            else return;
            curActivity++;
        } else if (bot.indexActivity === 2) {
            return;
        };
    };

    bot.setInterval(() => {
        for (let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            if (!guildId) continue;
            let guild = bot.guilds.get(guildId);
            if (!guild) continue;
            let member = guild.members.get(i);
            let mutedRole = guild.roles.get(r => r.name === "Karen Muted").catch();
            if (!mutedRole) continue;

            if (Date.now() > time) {
                if (!message.guild.me.hasPermission("MANAGE_ROLES")) return
                member.roles.remove(mutedRole);
                delete bot.mutes[i];

                fs.writeFile("./datastorage/mutes.json", JSON.stringify(bot.mutes), err => {
                    if (err) throw err;
                    bot.logger.error(err);
                })
            }
        }

    }, 5000)
    // makes cmds work on first message
    setInterval(() => {
        if (ran === true) return

        let load = bot.events.get("message");

        if (load) {
            load.run(bot).catch();
            var ran = true;
        }

    }, 50);
});

bot.on("message", async message => {
    //bot.logger.info(blackListed)
    //return;
    // ------------------------------------------------------------------
    if (loggedIN === 0) return;
    if (dbLoad === false) return;
    let prefix = bot.config.prefix;

    if (message.channel.type === "dm") return
    if (bot.config.Testing) {
        if (message.author.id !== bot.config.ownerID) return;
    } else {
        await new Promise(function (resolve, reject) {
            bot.extra.getPrefix(bot, message.guild, function (prefixCB) {
                prefix = prefixCB;
                resolve();
            });
        })

    }

    if (!message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}reloadwebsite`)) {
        if (message.author.id === botconfig.ownerID) {
            message.channel.send("Reloaded website").catch();
            websiteReload();
            return;

        } else return;
    } else if (message.content.startsWith(`${prefix}reloadEvents`)) {
        if (message.author.id === botconfig.ownerID) {
            message.channel.send("Reloaded Events").catch();
            reloadEvents();
            return;

        } else return;
    }

    let eventLoader = bot.events.get("message");

    if (eventLoader === undefined) return;
    eventLoader.run(bot, message, prefix) //.catch(err => bot.logger.info("Event loading Error  " + err));

});
// -----------------------------------------------------------------
bot.on("guildCreate", guild => {

    bot.logger.info(`Joined ${guild.name}`)
    let defaultChannel = "";
    guild.channels.forEach((channel) => {
        if (channel.type === "text" && defaultChannel === "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })

    guildJoin = new Discord.MessageEmbed()

        .setTitle("Karen Joined the Server!")
        .setColor(botconfig.color)
        .setThumbnail(bot.user.displayAvatarURL())
        .addField("Prefix", 'If you want to use a prefix other than "!!"')
        .addField("Prefix change", "Type !!prefix <your prefix>")
        .addField("❤", "I hope i can be helpful for you.")
        .addField("Help", "For help for commands refer to [Commands](https://gamu.tk/commands)");


    defaultChannel.send(guildJoin)
        .catch(bot.logger.error);

});

bot.on("guildMemberAdd", async member => {
    if (loggedIN !== 1) return;

});

bot.on("error", (err) => bot.logger.error(err));

if (botconfig.botToken === "") return bot.logger.error("Bot token not set")

bot.login(botconfig.botToken)
//.catch((e) => bot.logger.info(e));

var loggedIN = 1;
//return;


process.on('unhandledRejection', error => bot.logger.error('Uncaught Promise Rejection', error));

bot.on('shardDisconnect', function (event, shardID) {
    bot.logger.error(`----- Bot disconnected from Discord with code, ${event}, Shard: ${shardID} -----`);
});

bot.on('warn', (warn) => bot.logger.warn(warn));

//bot.on('resume', (resume) => bot.logger.info(resume));

// bot.on('debug', bot.logger.info);

bot.on('shardError', error => {
    bot.logger.error('A websocket connection encountered an error:', error);
});
let webTimer = setInterval(() => {
    if (dbLoad === false) return;
    else {
        websiteReload();
        clearInterval(webTimer);
    }

}, 10000)


function websiteReload() {

    fs.readdir(__dirname + "/externalLoading/website", (err, files) => {
        if (err) bot.logger.info(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
            return;
        }
        jsfile.forEach(async (f, i) => {
            delete require.cache[require.resolve(__dirname + `/externalLoading/website/${f}`)]
            let probs = require(__dirname + `/externalLoading/website/${f}`);
            bot.website.set(probs.help.name, probs);

            let websiteLoader = bot.website.get("website");

            setTimeout(() => {
                websiteLoader.run(bot).catch(err => bot.logger.error("Website loading Error  " + err));
            }, 5000);
        });
    })
};

function reloadEvents() {

    fs.readdir(__dirname + "/externalLoading/bot_events/", (err, files) => {

        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
            return;
        }
        jsfile.forEach((f, i) => {
            delete require.cache[require.resolve(__dirname + `/externalLoading/bot_events/${f}`)]
            let probs = require(__dirname + `/externalLoading/bot_events/${f}`);
            bot.events.set(probs.help.name, probs);

        })


    });

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}