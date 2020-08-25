import * as path from 'path';
require('dotenv').config({
    path: path.join(__dirname, '/.env')
});

import * as logger from './logger';
const botconfig = process.env;
import Discord = require("discord.js");
import moment from "moment-timezone";
import fs from 'fs';
import osutils from "os-utils";
import fetch from 'node-fetch';
import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(botconfig.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
import * as redis from 'redis';

let dbLoad: Boolean = false;

mongoClient.connect(async (err: Error) => {
    if (err) bot.logger.error(err);

    bot.logger.info(`Connected to database`);

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

const bot: any = new Discord.Client();

bot.commands = new Discord.Collection;
bot.activities = new Discord.Collection;
bot.events = new Discord.Collection;
bot.youtube = new Discord.Collection;
bot.stats = new Discord.Collection;
bot.mutes = require("./datastorage/mutes.json");
bot.blackListedGuilds = require("./datastorage/blackListedGuilds.json");
bot.blackListedUsers = require("./datastorage/blackListedUsers.json");
bot.logger = logger;
let loggedIN: number = 0;
const YouTube = require("simple-youtube-api");

require('events').EventEmitter.defaultMaxListeners = 20;
bot.extra = require('./externalLoading/extra');
bot.config = botconfig;
import website from './externalLoading/website/Website';



bot.youtube = new YouTube(bot.config.googleAPI);
bot.redis = redis.createClient();

bot.redis.on('connect', () => {
    bot.logger.info("Connected to redis database!");
})

/*bot.on("shardReconnecting", , id => console.log(`Shard with ID ${id} reconnected.`));*/
bot.redis.on("error", function (error: Error) {
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
        osutils.cpuUsage((v: any) => {


            bot.stats.usage = {
                cores: osutils.cpuCount(),
                cpuUsage: (v * 100).toFixed(0) + "%",
                avgLoad: osutils.loadavg(5),
                platform: osutils.platform()
            }
        })
    }, 1000);
    bot.serverList = bot.guilds.cache.map((g: Discord.Guild) => {
        return {
            Name: g.name,
            MemberCount: g.memberCount,
            Owner: g.owner.user.username
        };
    });

    bot.serverList.sort((a: any, b: any) => b.MemberCount - a.MemberCount);

    ////////////////

    reloadEvents();
    /////////

    bot.logger.info(`${bot.user.username} is online!`);

    if (dbLoad === false) await sleep(5000);

    await bot.db.xpDB.find({
        messageCount: 1
    }).forEach(async (x: any) => {
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
            let fet: any = await fetch('https://decapi.me/twitch/uptime/gamevsplayer')
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


        let twitchStatus: any = await fetch(`https://api.twitch.tv/helix/streams?user_id=97947067`, {
            method: 'GET',
            headers: {
                "Client-ID": bot.config.TwitchID,
                "Authorization": `Bearer ${bot.config.TwitchAuth}`
            }

        }).catch((err: Error) => bot.logger.error(err));
        twitchStatus = await twitchStatus.json();

        if (twitchStatus.data === undefined) {
            notification = false;
            return activityLoop();
        }

        if (twitchStatus.data[0] !== undefined) {
            if (twitchStatus.data[0].type === 'live') {
                let twitchGame: any = await fetch(`https://api.twitch.tv/helix/games?id=${twitchStatus.data[0].game_id}`, {
                    method: 'GET',
                    headers: {
                        "Client-ID": bot.config.TwitchID,
                        "Authorization": `Bearer ${bot.config.TwitchAuth}`
                    }
                });
                twitchGame = await twitchGame.json();
                bot.user.setActivity(`${twitchGame.data[0].name} on Twitch!`, {
                    url: `https://twitch.tv/${twitchStatus.data[0].user_name}`,
                    type: 'STREAMING'
                }).catch((err: Error) => bot.logger.error(err));
                if (notification === false) {

                    let messageChannel: Discord.TextChannel = await bot.channels.get("154338003207061504");
                    let pingRole = messageChannel.guild.roles.cache.get("426742035761070091");
                    await pingRole.setMentionable(true);

                    let pingEmbed: Discord.MessageEmbed = new Discord.MessageEmbed()
                        .setTitle("Now Streaming")
                        .setURL(`https://gamu.tk/twitch`)
                        .setColor(bot.config.color)
                        .addField("Title", twitchStatus.data[0].title)
                        .addField("Game", twitchGame.data[0].name)
                        .setThumbnail(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${(twitchStatus.data[0].user_name).toLowerCase()}-1920x1080.jpg`);
                    await messageChannel.send(`<@&${pingRole.id}>`).catch((e: Error) => messageChannel.send(e));
                    await pingRole.setMentionable(false);
                    messageChannel.send(pingEmbed).catch((e: Error) => messageChannel.send(e));
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
            if (activity) activity.run(bot).catch((error: Error) => bot.logger.error(error));
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
            let mutedRole = guild.roles.get((r: Discord.Role) => r.name === "Karen Muted").catch();
            if (!mutedRole) continue;

            if (Date.now() > time) {
                let message: Discord.Message = bot.guilds.cache.get(guildId);
                if (!message.guild.me.hasPermission("MANAGE_ROLES")) return
                member.roles.remove(mutedRole);
                delete bot.mutes[i];

                fs.writeFile("./datastorage/mutes.json", JSON.stringify(bot.mutes), (err: Error) => {
                    if (err) throw err;
                    bot.logger.error(err);
                })
            }
        }

    }, 5000)
    if (bot.stats.usage === undefined) await sleep(5000);
    website(bot);
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

bot.on("message", async (message: Discord.Message) => {
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
        await new Promise(function (resolve) {
            bot.extra.getPrefix(bot, message.guild, function (prefixCB: string) {
                prefix = prefixCB;
                resolve();
            });
        })

    }

    if (!message.content.startsWith(prefix)) return;

    else if (message.content.startsWith(`${prefix}reloadEvents`)) {
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
bot.on("guildCreate", (guild: Discord.Guild) => {

    bot.logger.info(`Joined ${guild.name}`)
    let defaultChannel: any = "";
    guild.channels.cache.forEach((channel: any) => {
        if (channel.type === "text" && defaultChannel === "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })

    let guildJoin: Discord.MessageEmbed = new Discord.MessageEmbed()

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

bot.on("guildMemberAdd", async (_member: Discord.GuildMember) => {
    if (loggedIN !== 1) return;

});

bot.on("error", (err: Error) => bot.logger.error(err));

if (botconfig.botToken === "") bot.logger.error("Bot token not set")

else bot.login(botconfig.botToken);
//.catch((e) => bot.logger.info(e));

loggedIN = 1;
//return;


process.on('unhandledRejection', error => bot.logger.error('Uncaught Promise Rejection', error));

bot.on('shardDisconnect', function (event: any, shardID: Number) {
    bot.logger.error(`----- Bot disconnected from Discord with code, ${event}, Shard: ${shardID} -----`);
});

bot.on('warn', (warn: Error) => bot.logger.warn(warn));

//bot.on('resume', (resume) => bot.logger.info(resume));

// bot.on('debug', bot.logger.info);

bot.on('shardError', (error: Error) => {
    bot.logger.error('A websocket connection encountered an error:', error);
});

function reloadEvents() {

    fs.readdir(__dirname + "/externalLoading/bot_events/", (err: Error, files: string[]) => {
        if (err) bot.logger.error(err);
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
            return;
        }
        jsfile.forEach((f) => {
            delete require.cache[require.resolve(__dirname + `/externalLoading/bot_events/${f}`)]
            let probs: any = require(__dirname + `/externalLoading/bot_events/${f}`);
            bot.events.set(probs.help.name, probs);

        })


    });

}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}