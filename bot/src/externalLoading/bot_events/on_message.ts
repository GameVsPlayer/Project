const active = new Map();
import YTDL from "ytdl-core-discord";
import path from "path";
import jimp from "jimp";
import fs from "fs";
import Discord, { Message, VoiceConnection, MessageEmbed, Role, TextChannel, GuildChannel } from "discord.js";
import moment from "moment-timezone";

let servers: any = {};
let messagesGlobal: number = 0;
let songsMessage: string, songsID: string, videoURL: string;
Message
module.exports.run = async (bot: any, message: Message, prefix: string) => {

    if (Number.isNaN(bot.stats.userMessages)) {
        reload(bot);
        bot.stats.userMessages = 0;
        bot.stats.botCommands = 0;
    }

    if (!message) return;

    if (message.author.bot) return;
    if (message.channel.type === "dm") {

        if (!message.content.startsWith(`${bot.config.prefix}todo`)) return;
        if (message.author.id !== bot.config.ownerID) return;
        let dmFile = bot.commands.get("todo");

        if (dmFile) dmFile.run(bot, message).catch((err: Error) => bot.logger.info("Todo Error  " + err));
    }

    if (!message.guild) return

    bot.stats.userMessages++;

    let mainCommand: boolean = false;

    let messageArray = message.content.split(" ");

    let args: any = messageArray.slice(1);

    let indexActivity: number = 0;

    if (message.guild.id == bot.blackListedGuilds || message.author.id == bot.blackListedUsers) return;

    bot.sendMessages = (!message.guild.me.hasPermission("SEND_MESSAGES"))

    let sendEmbeds = (!message.guild.me.hasPermission("EMBED_LINKS"))

    { //XP
        let xp = await bot.db.xpDB.findOne({
            userid: message.author.id
        }).catch(async (err: Error) => {
            if (err) {
                return bot.logger.error(err);
            }
            if (await xp === null) {
                const data = {
                    userid: message.author.id,
                    level: 1,
                    messageCount: 1
                }
                await bot.db.xpDB.insertOne(data).catch((e: Error) => bot.logger.error(e));
            }
            if (xp !== null) {
                let l = xp.level;
                let i = xp.messageCount;

                await bot.db.xpDB.findOneAndUpdate({
                    userid: message.author.id
                }, {
                    "$inc": {
                        messageCount: 1
                    }
                }).catch((e: Error) => bot.logger.error(e));

                let messagesNeed: Number = Math.floor((l * 100) * (0.5 * l));

                if (i >= messagesNeed) {
                    await bot.db.xpDB.findOneAndUpdate({
                        userid: message.author.id
                    }, {
                        "$inc": {
                            level: 1
                        }
                    }).catch((e: Error) => bot.logger.error(e));
                    if (2 >= l) return;
                    else if (!bot.sendMessages) {
                        let levelUpEmbed = new Discord.MessageEmbed()
                            .setTitle("Level Up!")
                            .setDescription(`${message.author} You have send ${(i)} Messages, so you leveled up! You are now level ${l + 1}!`);
                        message.channel.send(levelUpEmbed).catch((e: Error) => bot.logger.error(e));
                    }
                }
            }
        });

    }

    if (!message.content.startsWith(prefix)) return;
    //if(message.content.startsWith(prefix + "a")) captcha(message).catch(); mainCommand = 1;
    { //cmds
        if (message.content.startsWith(prefix + "blUser") && message.author.id == bot.config.ownerID) {
            if (args[0] === null) return message.reply("No userID specified");
            if (Number.isNaN(args[0])) return message.reply("Thats not a ID");
            if (args[0].length !== 18) return message.channel.send("Thats not a valid id");
            mainCommand = true;
            bot.blackListedUsers[args[0]] = {
                date: moment(moment.now()).format("DD/MM/YYYY hh:mm:ss")
            }

            fs.writeFile("./datastorage/blackListedUsers.json", JSON.stringify(bot.blackListedUsers, null, 4), (err: Error) => {
                if (err) throw err;
                message.channel.send("Blacklisted that user!").catch();
            });
        }

        if (message.content.startsWith(prefix + "blGuild") && message.author.id == bot.config.ownerID) {
            mainCommand = true;
            if (args[0] === null) return message.reply("No guildID specified");
            if (Number.isNaN(args[0])) return message.reply("Thats not a ID");
            if (args[0].length !== 18) return message.channel.send("Thats not a valid id");
            bot.blackListedGuilds[args[0]] = {
                date: moment(moment.now()).format("DD/MM/YYYY hh:mm:ss")
            }

            fs.writeFile("./datastorage/blackListedGuilds.json", JSON.stringify(bot.blackListedGuilds, null, 4), (err: Error) => {
                if (err) throw err;
                message.channel.send("Blacklisted that guild!").catch();
            });

        }
        if (message.content.startsWith(prefix + "unblGuild") && message.author.id == bot.config.ownerID) {
            mainCommand = true;
            if (!args[0]) return message.channel.send("No guild to be unblocked specified")
            if (args[0].length !== 18) return message.channel.send("No valid id specified");

            if (bot.blackListedGuilds[args[0]] == undefined) return message.channel.send("No blacklisted Guild with that id found")

            delete bot.blackListedGuilds[args[0]];

            fs.writeFile("./datastorage/blackListedGuilds.json", JSON.stringify(bot.blackListedGuilds), (err: Error) => {
                if (err) throw err;
                bot.logger.error(err);
            })
        }
        if (message.content.startsWith(prefix + "unblUser") && message.author.id == bot.config.ownerID) {
            mainCommand = true;
            if (!args[0]) return message.channel.send("No user to be unblocked specified")
            if (args[0].length !== 18) return message.channel.send("No valid id specified");

            if (bot.blackListedUsers[args[0]] == undefined) return message.channel.send("No User Guild with that id found")

            delete bot.blackListedUsers[args[0]];

            fs.writeFile("./datastorage/blackListedUsers.json", JSON.stringify(bot.blackListedUsers), (err: Error) => {
                if (err) throw err;
                bot.logger.error(err);
            })
        }
        if (message.content.startsWith(prefix + "reload") && message.author.id == bot.config.ownerID) {
            reload(bot);
            return message.reply("Successfully reloaded!");
        }
        if (message.content.startsWith(prefix + "customActivity") && message.author.id == bot.config.ownerID) {
            if (args[0] == undefined) return message.channel.send("hmm")
            var customType = args[0]
            if (args[1] == undefined) return message.channel.send("aa");
            var customActivity = args.slice(1).toString();
            indexActivity = 2;
            mainCommand = true;
            bot.user.setActivity(customActivity, {
                type: customType
            }).catch();
        }
        if (message.content.startsWith(prefix + "endcustomActivity") && message.author.id == bot.config.ownerID) {
            indexActivity = 0;
            mainCommand = true;
        }

        if (message.content.startsWith(prefix + "leave") && message.author.id == bot.config.ownerID) {
            if (args[0] === undefined) return;
            var guildID = bot.guilds.cache.get(args[0])

            if (guildID === null) return;
            guildID.leave().catch((e: Error) => bot.logger.info(e));
            mainCommand = true;
            return message.channel.send(`Sucessfully left ${args[0]}`);
        }
        if (mainCommand === true) return;
        let cName: GuildChannel = message.guild.channels.cache.get(message.channel.id);

        if (message.content.startsWith(prefix)) bot.logger.info(`[${moment().format('D.MM, h:mm a')}][${message.guild.name}][${cName.name}][${message.author.username}]:${message.content}`);
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        let uptimeMin: number = bot.uptime / 60000;

        if (message.content.startsWith(prefix + "global_messages") && message && !bot.sendMessages && messagesGlobal !== 0 && uptimeMin !== 0) {
            return message.channel.send(`${messagesGlobal} Messages have been send globaly since the bot last restarted thats ${messagesGlobal / uptimeMin} Messages per minute!`)
        }

        const cmdcheckargs: RegExp = /[a-z]/i;
        const slicedPrefix: string = message.content.slice(prefix.length)
        if (!(slicedPrefix).match(cmdcheckargs)) return;

        //if (message.content.startsWith(prefix + "captcha")) captcha(message,bot).catch(err => bot.logger.info(err))

        if (message.content == `${prefix}maintenance`) {
            if (message.author.id === (bot.config.ownerID)) {
                indexActivity = 0;
                bot.user.setActivity("MAINTENANCE", {
                    type: "PLAYING"
                });
                message.channel.send("Bot is now in maintenance").then((message: any) => {
                    message.delete({
                        timeout: 1000
                    }).catch();
                }).then((m: any) => m.delete({
                    timeout: 0
                }).catch((_O_o: null) => { }));
            } else return;

        }
        if (message.content == `${prefix}nomaintenance`) {
            if (message.author.id === (bot.config.ownerID)) {
                indexActivity = 1;
                message.channel.send("Bot is no longer in maintenance").then((message: any) => {
                    message.delete({
                        timeout: 1000
                    }).catch();
                }).then((m: any) => m.delete({
                    timeout: 1000
                }).catch((_O_o: null) => { }));
            } else return;

        }
    } { //music
        if (message.content.startsWith(prefix + "play")) {
            mainCommand = true;
            if (bot.sendMessages) return;

            if (!message.member.voice.channel) return message.reply("Please connect to a voice channel first!").catch();

            if (!args[0]) return message.reply("Please input something").catch();

            let validate = YTDL.validateURL(args[0])

            let videoURL: string = "";
            if (validate) {
                videoURL = args.join(" ");
            } else {
                videoURL = await YTSearch(args, bot, message);
            }

            if (typeof videoURL != "string") return

            if (!YTDL.validateURL(videoURL)) return;

            if (!message.member.voice.channel) {
                if (bot.sendMessages) return;
                return message.reply("You must be in a voicechannel").catch()
            }
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: [],
                    requester: []
                }
            }
            let server = servers[message.guild.id];

            server.queue.push(videoURL);

            server.requester.push(message.author);

            if (bot.sendMessages) return;
            else message.channel.send(`Added ${message.author}`);
            if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
                message.delete({
                    timeout: 0
                }).catch();
            }
            if (!message.guild.me.hasPermission("CONNECT")) {
                server.queue = [];
                if (bot.sendMessages) return;
                return message.channel.send("I dont have the connect permission").catch()
            }

            if (!message.guild.me.voice.connection) {
                message.member.voice.channel.join().catch((err: Error) => message.channel.send(`Something went wrong ${err}`)).then((connection: any) => {

                    play(connection, message, bot).catch(err => {
                        if (bot.sendMessages) return;
                        else message.channel.send(`Something went wrong ${err}`)
                    })
                        .catch((e) => bot.logger.error(e));
                })
            }
        }

        if (message.content.startsWith(prefix + "skip")) {
            mainCommand = true;
            var server = servers[message.guild.id];
            if (!message.member.voice.channel) {
                if (bot.sendMessages) return;
                return message.reply("You must be in a voicechannel").catch()
                    .catch((e: Error) => bot.logger.error(e));

            }
            if (message.member.voice.channelID != message.guild.me.voice.channelID) {
                if (bot.sendMessages) return;
                message.reply("You are not in the same voicechannel as me!").catch();
            }


            if (!message.guild.voice.connection)
                if (bot.sendMessages) return;
                else return message.reply("There is no music playing!").catch();
            if (!server.dispatcher) return;
            server.dispatcher.end();
            if (bot.sendMessages) return;
            return message.channel.send(`${message.author} skipped the song!`)
                .catch((e: Error) => bot.logger.error(e));

        }

        if (message.content.startsWith(prefix + "end")) {
            mainCommand = true;
            var server = servers[message.guild.id];
            server.queue = [];
            if (message.guild.voice.connection) message.guild.voice.connection.disconnect();

            return;
        }

        if (message.content.startsWith(prefix + "queue")) {
            mainCommand = true;
            if (bot.sendMessages) return;

            var server = servers[message.guild.id];
            if (!server) return message.channel.send("No Songs in queue")
            if (!server.queue) return message.channel.send("No Songs in queue")
            if (server.queue.length < 0) return message.channel.send("No Songs in queue")
            var songsArray = [];
            let i = 0;
            for (i = 0; i < server.queue.length && i < 5; i++) {
                let songInfo = await YTDL.getInfo(server.queue[i]);
                songsArray.push(`[${i + 1}]. ${songInfo.title} Requested by: ${server.requester[i]} \n`)
                var songsArray5 = songsArray.slice(0, 4);

            }
            if (sendEmbeds) return message.channel.send("I dont have the permission to send embeds")
            let queueEmbed = new Discord.MessageEmbed()

                .setTitle(`First ${i} Songs of the queue and the current Song`)
                .setColor(bot.config.color)
                .setDescription(songsArray5)

            return message.channel.send(queueEmbed)

        }
        if (message.content.startsWith(prefix + "volume")) {
            mainCommand = true;
            var server = servers[message.guild.id];
            if (bot.sendMessages) return;
            else if (!server) return message.channel.send("There is nothing playing right now");
            mainCommand = true;
            if (bot.sendMessages) return;
            else if (!server.dispatcher) return message.channel.send("There is no music playing right now");
            if (bot.sendMessages) return;
            else if (!args[0]) return message.channel.send(`The current volume is ${(server.dispatcher.volume * 100).toFixed(0)}%`);
            if (Number.isNaN(args[0])) return message.channel.send("That is not a number!");
            Math.floor(args[0]);
            if (args[0] > 100 || args[0] < 0) return message.channel.send("Please specify a value between 0 and 100")

            server.volume = args[0];
            server.dispatcher.setVolume(args[0] / 100)
            if (bot.sendMessages) return;
            //else return message.channel.send(`The Volume was changed to ${Math.floor(messageArray[1])}`)
            server.dispatcher.on('volumeChange', (oldVolume: number, newVolume: number) => {
                message.channel.send(`Volume changed from ${(oldVolume * 100).toFixed(0)}% to ${(newVolume * 100)}%.`);
            });

        }
        if (message.content.startsWith(prefix + "pause")) {
            mainCommand = true;
            var server = servers[message.guild.id];
            if (bot.sendMessages) return;
            else if (!server) return message.channel.send("There is nothing playing right now");
            if (bot.sendMessages) return;
            else if (!server.dispatcher) return message.channel.send("There is nothing playing right now");
            mainCommand = true;
            if (server.dispatcher.paused === false) {
                message.channel.send(`Playback paused by <@${message.author.id}>!`);
                return server.dispatcher.pause(true);
            }
            else {
                message.channel.send(`Playback resumed by <@${message.author.id}>!`);
                return server.dispatcher.resume();
            }

        }
    }

    if (mainCommand) {
        return;
    }

    let cmd = messageArray[0];
    let ops = {
        active: active
    }
    bot.stats.botCommands++;

    let commandfile = bot.commands.get(cmd.slice(prefix.length));

    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return bot.logger.info(`${message.guild.name} doesnt allow me to chat!`);

    if (commandfile) {
        commandfile.run(bot, message, args, ops).catch((err: Error) => {
            let DisErr = err.toString().replace(/<a\b[^>]*>(.*?)<\/a>/i, "");
            message.channel.send(`Error ${DisErr}`);
            bot.logger.info(`Command Error: ${commandfile.help.name} ${err}`);
        });
    } else if (!bot.sendMessages) {
        message.channel.send("That is no valid command!")
            .then((message: any) => {
                message.delete({
                    timeout: 5000
                }).catch();
            })
    } else return;

}
module.exports.help = {
    name: "message"
};

async function play(connection: VoiceConnection, message: Message, bot: any) {
    var server = servers[message.guild.id];

    if (server.queue.length < 0) return;
    if (!message.guild.me.hasPermission("SPEAK")) {
        server.queue = [];
        if (message.guild.voice.connection) message.guild.voice.connection.disconnect();
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        return message.channel.send("I dont have the speak permission");
    }
    let info = await YTDL.getInfo(server.queue[0]).catch();

    const stream = () => {
        return YTDL.downloadFromInfo(info, {
            filter: 'audioonly'
        });
    }

    //let stream = YTDL(server.queue[0], {filter: "audioonly", liveBuffer: 60000 });
    server.dispatcher = connection.play(stream());

    server.dispatcher.on("error", bot.logger.error);

    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

    let nowPlaying: MessageEmbed = new Discord.MessageEmbed()

        .setTitle("Now Playing")
        .setColor(bot.config.color)
        .setDescription(`${info.title} Requested by ${server.requester[0]}`);

    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return null;
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I don\'t have the permission to send embeds");
    else message.channel.send(nowPlaying);

    server.dispatcher.on("finish", async () => {
        await server.queue.shift();
        await server.requester.shift();
        if (server.queue[0]) play(connection, message, bot).catch((err) => message.channel.send(`Something went wrong ${err}`));
        else connection.disconnect();
    })
}


async function captcha(message: Message, bot: any) { // Source https://github.com/y21/discordcaptcha (modified)
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I dont have the permission to give users roles").catch();

    let captchaConfig = JSON.parse(fs.readFileSync("./datastorage/captchaConfig.json", "utf8"));

    if (!captchaConfig[message.guild.id]) {
        captchaConfig[message.guild.id] = {
            captcha: false
        };
    }

    if (captchaConfig[message.guild.id].captcha !== true) {
        return null;
    }

    let rand = Math.random().toString(36).substr(2, 1);
    let _image = await jimp.read("https://i.imgur.com/mkoc2Fh.jpg");
    let _font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    let _coordinates = [Math.random() * 400, Math.random() * 400]; // x & y coordinates for text on image
    _image.resize(750, 750); // make bigger
    _image.print(_font, _coordinates[0], _coordinates[1], rand); // print captcha on image
    _image.invert(); // make image black with white text
    _image.greyscale();
    _image.resize(300, 300) // default max embeded size

    var verifyAuthor = message.author;
    var toVerify = message.guild.members.fetch(message.author.id)
    let channelName: TextChannel = bot.channels.cache.get(message.channel.id);
    channelName.name
    message.author.send(new Discord.MessageEmbed()
        .setTitle("Verification")
        .setDescription(`${message.guild.name}is protected by DiscordCaptcha`)
        .addField("Instructions", `In a few seconds an image will be sent to you which includes a number. Please send verify <captcha> into the channel ${channelName.name} (${message.channel})`)
        .setColor(bot.config.color)
        .setTimestamp()
    ).catch((e: Error) => e.toString().includes("Cannot send messages to this user") ? message.reply("please turn on dms") : null);
    _image.getBuffer(jimp.MIME_PNG, async (err: Error, buff: Buffer) => {
        await message.author.send(new Discord.MessageAttachment(buff, "captcha.jpg")).catch();

    });
    try {
        try {
            await message.channel.awaitMessages((message: Message) => message.content == `verify ${rand}` && message.author.id == verifyAuthor.id, {
                max: 1,
                time: 60000,
                errors: ['time']
            })
        } catch (err) {
            return message.author.send("No or invalid value entered").catch()
        };
    } catch (err) {
        return message.author.send("No or invalid value entered").catch()
    };

    let role: Role = message.guild.roles.cache.find((r: Role) => r.name === "member");
    (await toVerify).roles.add(role).catch((err: Error) => {
        return message.channel.send(`Something went wrong: ${err}`)
    })
    message.reply(`You've been verified!`)
};



function reload(bot: any) {
    fs.readdir(path.join(__dirname, '../../commands'), (err: Error, files: any) => {


        if (err) bot.logger.info(err);

        let jsfile = files.filter((f: any) => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
            return;
        }
        jsfile.forEach((f: string) => {
            delete require.cache[require.resolve(`${path.join(__dirname, '../../commands')}/${f}`)]
            let probs = require(`${path.join(__dirname, '../../commands')}/${f}`);
            bot.commands.set(probs.help.name, probs);
            bot.commands.set(probs.help.alias, probs);
        });


    });
    fs.readdir(path.join(__dirname, '../activities/'), (err: Error, files: any) => {
        if (err) return null;
        let jsfile2 = files.filter((f2: any) => f2.split(".").pop() === "js")
        if (jsfile2.length <= 0) {
            return;
        }
        jsfile2.forEach((f2: any, i: any) => {
            delete require.cache[require.resolve(`${path.join(__dirname, '../activities/')}/${f2}`)]
            let probs2 = require(`${path.join(__dirname, '../activities/')}${f2}`);
            bot.activities.set(probs2.activity.name, probs2);
        })


    })
}
async function YTSearch(search: string[], bot: any, message: any) {
    let videos = await bot.youtube.searchVideos(search.join(" "), 10).catch();
    let video, response: any;
    let index = 0;
    let requesterID = message.author.id;
    if (bot.sendMessages) return;
    if (videos.length < 1) return message.channel.send("I could not obtain any search results").catch()
    message.channel.send(`
${videos.map((videos2: any) => `${++index} ${videos2.title}`).join('\n')}

Please provide a value to select one of the search results ranging from 1-${videos.length}.
`).then((message: any) => songsMessage = message)
        .then(songsID = message.channel.id);
    await message.channel.awaitMessages((message2: any) => message2.content > 0 && message2.content < 11 && message.author.id == requesterID, {
        max: 1,
        time: 10000,
        errors: ['time']
    }).then((match: any) => response = match)
        .catch((err: Error) => {
            if (err) return message.channel.send("something went wrong");
            message.channel.messages.fetch(songsMessage).catch()
                .then((msg: any) => msg.delete({
                    timeout: 0
                })).catch();
            if (!bot.sendMessages) return message.channel.send("No or invalid value entered, cancelling video selection").then((msg: any) => {
                msg.delete({
                    timeout: 5000
                }).catch().then(
                    message.channel.messages.fetch(songsMessage)
                        .then((msg: any) => msg.delete({
                            timeout: 0
                        })))
            })
            else return;
        })
    if (response) {
        const videoIndex = parseInt(response.first().content);
        video = await bot.youtube.getVideoByID(videos[videoIndex - 1].id);
        videoURL = `https://www.youtube.com/watch?v=${video.id}`;
        let validate = YTDL.validateURL(videoURL);
        message.channel.messages.fetch(songsMessage)
            .then((msg: any) => msg.delete({
                timeout: 0
            }));
        if (validate) return videoURL;
    }
}