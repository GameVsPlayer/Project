const active = new Map();
const YTDL = require("ytdl-core");
const path = require("path");
const jimp = require("jimp");
const fs = require("fs");
const Discord = require("discord.js");
const moment = require("moment-timezone");
let servers = {};

module.exports.run = async (bot, message) => {

    if (Number.isNaN(bot.stats.userMessages)) {
        reload(bot);
        bot.stats.userMessages = 0;
        bot.stats.botCommands = 0;
    }


    if (!message) return;

    if (message.author.bot) return;

    if (message.channel.type === "dm") {
        bot.logger.info(bot.config.prefix);
        if (!message.content.startsWith(`${bot.config.prefix}todo`)) return;
        if (message.author.id !== bot.config.ownerID) return;
        let dmFile = bot.commands.get("todo");

        if (dmFile) dmFile.run(bot, message).catch(err => bot.logger.info("Todo Error  " + err));

    }

    if (!message.guild) return

    bot.stats.userMessages++;

    var mainCommand = 0;

    let youtube = bot.youtube;

    let messageArray = message.content.split(" ");

    let args = messageArray.slice(1);

    if (message.guild.id == bot.blackListedGuilds || message.author.id == bot.blackListedUsers) return;

    let sendMessages = (!message.guild.me.hasPermission("SEND_MESSAGES"))

    let sendEmbeds = (!message.guild.me.hasPermission("EMBED_LINKS"))



    { //XP
        let xp = await bot.db.xpDB.findOne({
            userid: message.author.id
        }).catch(async (err) => {
            if (err) {
                return bot.logger.error(err);
            }
            if (await xp === null) {
                const data = {
                    userid: message.author.id,
                    level: 1,
                    messageCount: 1
                }
                await bot.db.xpDB.insertOne(data).catch((e) => bot.logger.error(e));
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
                }).catch((e) => bot.logger.error(e));

                messagesNeed = Math.floor((l * 100) * (0.5 * l));
                if (i >= messagesNeed) messages = messagesNeed; // level     

                if (i >= messagesNeed) {
                    await bot.db.xpDB.findOneAndUpdate({
                        userid: message.author.id
                    }, {
                        "$inc": {
                            level: 1
                        }
                    }).catch((e) => bot.logger.error(e));
                    if (2 >= l) return;
                    else if (!sendMessages) {
                        let levelUpEmbed = new Discord.RichEmbed()
                            .setTitle("Level Up!")
                            .setDescription(`${message.author} You have send ${(i)} Messages, so you leveled up! You are now level ${l + 1}!`);
                        message.channel.send(levelUpEmbed).catch((e) => bot.logger.error(e));
                    }
                }
            }
        });

    }

    let prefix = process.env.prefix;

    if (!message.content.startsWith(prefix)) return;
    //if(message.content.startsWith(prefix + "a")) captcha(message).catch(); mainCommand = 1;
    { //cmds
        if (message.content.startsWith(prefix + "blUser") && message.author.id == bot.config.ownerID) {
            if (args[0] === null) return message.reply("No userID specified");
            if (Number.isNaN(args[0])) return message.reply("Thats not a ID");
            if (args[0].length !== 18) return message.channel.send("Thats not a valid id");
            mainCommand = 1;
            bot.blackListedUsers[args[0]] = {
                date: moment(moment.now()).format("DD/MM/YYYY hh:mm:ss")
            }

            fs.writeFile("./datastorage/blackListedUsers.json", JSON.stringify(bot.blackListedUsers, null, 4), (err) => {
                if (err) throw err;
                message.channel.send("Blacklisted that user!").catch();
            });
        }

        if (message.content.startsWith(prefix + "blGuild") && message.author.id == bot.config.ownerID) {
            mainCommand = 1;
            if (args[0] === null) return message.reply("No guildID specified");
            if (Number.isNaN(args[0])) return message.reply("Thats not a ID");
            if (args[0].length !== 18) return message.channel.send("Thats not a valid id");
            bot.blackListedGuilds[args[0]] = {
                date: moment(moment.now()).format("DD/MM/YYYY hh:mm:ss")
            }

            fs.writeFile("./datastorage/blackListedGuilds.json", JSON.stringify(bot.blackListedGuilds, null, 4), (err) => {
                if (err) throw err;
                message.channel.send("Blacklisted that guild!").catch();
            });

        }
        if (message.content.startsWith(prefix + "unblGuild") && message.author.id == bot.config.ownerID) {
            mainCommand = 1;
            if (!args[0]) return message.channel.send("No guild to be unblocked specified")
            if (args[0].length !== 18) return message.channel.send("No valid id specified");

            if (bot.blackListedGuilds[args[0]] == undefined) return message.channel.send("No blacklisted Guild with that id found")

            delete bot.blackListedGuilds[args[0]];

            fs.writeFile("./datastorage/blackListedGuilds.json", JSON.stringify(bot.blackListedGuilds), (err) => {
                if (err) throw err;
                bot.logger.error(err);
            })
        }
        if (message.content.startsWith(prefix + "unblUser") && message.author.id == bot.config.ownerID) {
            mainCommand = 1;
            if (!args[0]) return message.channel.send("No user to be unblocked specified")
            if (args[0].length !== 18) return message.channel.send("No valid id specified");

            if (bot.blackListedUsers[args[0]] == undefined) return message.channel.send("No User Guild with that id found")

            delete bot.blackListedUsers[args[0]];

            fs.writeFile("./datastorage/blackListedUsers.json", JSON.stringify(bot.blackListedUsers), (err) => {
                if (err) throw err;
                bot.logger.error(err);
            })
        }
        if (message.content.startsWith(prefix + "reload") && message.author.id == bot.config.ownerID) {
            await reload(bot);
            return message.reply("Successfully reloaded!");
        }


        if (message.content.startsWith(prefix + "customActivity") && message.author.id == bot.config.ownerID) {
            if (args[0] == undefined) return message.channel.send("hmm")
            var customType = args[0]
            if (args[1] == undefined) return message.channel.send("aa");
            var customActivity = args.slice(1).toString();
            global.indexActivity = 2;
            mainCommand = true;
            bot.user.setActivity(customActivity, {
                type: customType
            }).catch();
        }
        if (message.content.startsWith(prefix + "endcustomActivity") && message.author.id == bot.config.ownerID) {
            global.indexActivity = 1;
            mainCommand = true;
        }


        if (message.content.startsWith(prefix + "leave") && message.author.id == bot.config.ownerID) {
            if (args[0] === undefined) return;
            var guildID = bot.guilds.find("id", args[0])

            if (guildID === null) return;
            guildID.leave().catch();
            mainCommand = true;
            return message.channel.send(`Sucessfully left ${args[0]}`);

        }
        if (mainCommand === true) return;

        if (message.content.startsWith(prefix)) bot.logger.info("[" + moment().format('D.MM, h:mm a') + "]" + "[" + message.guild.name + "]" + "[" + message.channel.name + "]" + "[" + message.author.username + "]" + message.content)
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        if (message.content.startsWith(prefix + "global_messages") && message && !sendMessages && messagesGlobal !== 0 && uptimeMin !== 0) {
            return message.channel.send(`${messagesGlobal} Messages have been send globaly since the bot last restarted thats ${messagesGlobal / uptimeMin} Messages per minute!`)
        }



        var cmdcheckargs = /[a-z]/i;
        var slicedPrefix = message.content.slice(prefix.length)
        var check = (slicedPrefix).match(cmdcheckargs)
        if (check === null) return;
        if (!message.content.startsWith(prefix) && check !== true && slicedPrefix.length < 2) return;

        //if (message.content.startsWith(prefix + "captcha")) captcha(message).catch(err => bot.logger.info(err))

        if (message.content == `${prefix}maintenance`) {
            if (message.author.id === (bot.config.ownerID)) {
                indexActivity = 0;
                bot.user.setActivity("MAINTENANCE", {
                    type: "PLAYING"
                });
                message.channel.send("Bot is now in maintenance").then((message) => {
                    message.delete(1000)
                }).then(message.delete().catch((O_o) => {}));
            } else return;

        }
        if (message.content == `${prefix}nomaintenance`) {
            if (message.author.id === (bot.config.ownerID)) {
                indexActivity = 1;
                message.channel.send("Bot is no longer in maintenance").then((message) => {
                    message.delete(1000)
                }).then(message.delete().catch((O_o) => {}));
            } else return;

        }
    } { //music
        if (message.content.startsWith(prefix + "play")) {
            mainCommand = true;
            if (sendMessages) return;

            if (!message.member.voiceChannel) return message.reply("Please connect to a voice channel first!").catch();

            if (!args[0]) return message.reply("Please input something").catch();

            let validate = await YTDL.validateURL(args[0])

            let videoURL = "";
            if (!validate) {
                await YTSearch(args);
                async function YTSearch(search) {
                    var videos = await youtube.searchVideos(search.join(" "), 10).catch();
                    let index = 0;
                    var requesterID = message.author.id;
                    if (sendMessages) return;
                    if (videos.length < 1) return message.channel.send("I could not obtain any search results").catch()
                    message.channel.send(`
                ${videos.map((videos2) => `${++index} ${videos2.title}`).join('\n')}
                
    Please provide a value to select one of the search results ranging from 1-${videos.length}.
                `).then((message) => global.songsMessage = message)
                        .then(global.songsID = message.channel.id);
                    try {
                        try {
                            var response = await message.channel.awaitMessages((message2) => message2.content > 0 && message2.content < 11 && message.author.id == requesterID, {
                                maxMatches: 1,
                                time: 10000,
                                errors: ['time']
                            });
                        } catch (err) {
                            message.channel.fetchMessage(global.songsMessage).catch()
                                .then((msg) => msg.delete()).catch();
                            if (!sendMessages) return message.channel.send("No or invalid value entered, cancelling video selection");
                            else return;
                        }
                        const videoIndex = parseInt(response.first().content);
                        var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                    } catch (err) {
                        message.channel.fetchMessage(global.songsMessage)
                            .then((msg) => msg.delete());

                        if (!sendMessages) return message.channel.send("I couldnt not obtain any search results.");
                        else return;

                    }
                    videoURL = `https://www.youtube.com/watch?v=${video.id}`;
                    let validate = await YTDL.validateURL(videoURL)
                    message.channel.fetchMessage(global.songsMessage)
                        .then((msg) => msg.delete());
                    if (sendMessages) return;
                    if (!validate) return message.channel.send("No Song could be found").catch()
                }
            }
            if (videoURL === "") videoURL = args.join(" ");

            if (!YTDL.validateURL(videoURL)) return;

            if (!message.member.voiceChannel) {
                if (sendMessages) return;
                return message.reply("You must be in a voicechannel").catch()
            }
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: [],
                    requester: []
                }
            }
            var server = servers[message.guild.id];



            server.queue.push(videoURL);
            server.requester.push(message.author);


            if (sendMessages) return;
            else message.channel.send(`Added ${message.author}`);
            if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
                message.delete().catch();
            }
            if (!message.guild.me.hasPermission("CONNECT")) {
                server.queue = [];
                if (sendMessages) return;
                return message.channel.send("I dont have the connect permission").catch()
            }

            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().catch((err) => message.channel.send(`Something went wrong ${err}`)).then((connection) => {

                    play(connection, message, bot).catch(err => {
                            if (sendMessages) return;
                            else message.channel.send(`Something went wrong ${err}`)
                        })
                        .catch((e) => bot.logger.error(e));


                })
            }


        }


        if (message.content.startsWith(prefix + "skip")) {
            mainCommand = 1;
            var server = servers[message.guild.id];
            if (!message.member.voiceChannel) {
                if (sendMessages) return;
                return message.reply("You must be in a voicechannel").catch()
                    .catch((e) => bot.logger.error(e));

            }
            if (message.member.voiceChannelID != message.guild.me.voiceChannelID) {
                if (sendMessages) return;
                message.reply("You are not in the same voicechannel as me!").catch();
            }


            if (!message.guild.voiceConnection)
                if (sendMessages) return;
                else return message.reply("There is no music playing!").catch();
            if (!server.dispatcher) return;
            server.dispatcher.end().catch((err) => {
                if (!sendMessages) message.channel.send(`Something went wrong: ${err}`)
            });
            if (sendMessages) return;
            return message.channel.send(`${message.author} skipped the song!`)
                .catch((e) => bot.logger.error(e));

        }


        if (message.content.startsWith(prefix + "end")) {
            mainCommand = 1;
            var server = servers[message.guild.id];
            server.queue = [];
            if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

            return;
        }


        if (message.content.startsWith(prefix + "queue")) {
            mainCommand = 1;
            if (sendMessages) return;

            var server = servers[message.guild.id];
            if (!server) return message.channel.send("No Songs in queue")
            if (!server.queue) return message.channel.send("No Songs in queue")
            if (server.queue.length < 0) return message.channel.send("No Songs in queue")
            var songsArray = [];
            for (i = 0; i < server.queue.length && i < 5; i++) {
                let songInfo = await YTDL.getInfo(server.queue[i]);
                songsArray.push(`[${i}]. ${songInfo.title} Requested by: ${server.requester[i]} \n`)
                var songsArray5 = songsArray.slice(0, 4);

            }
            if (sendEmbeds) return message.channel.send("I dont have the permission to send embeds")
            let queueEmbed = new Discord.RichEmbed()

                .setTitle(`First ${i - 1} Songs of the queue and the current Song`)
                .setColor(bot.config.color)
                .setDescription(songsArray5)

            return message.channel.send(queueEmbed)

        }
        if (message.content.startsWith(prefix + "volume")) {
            var server = servers[message.guild.id];
            if (sendMessages) null;
            else if (!server) return message.channel.send("There is nothing playing right now");
            mainCommand = true;
            if (sendMessages) null;
            else if (!server.dispatcher) return message.channel.send("There is no music playing right now");
            if (sendMessages) null;
            else if (!messageArray[1]) return message.channel.send(`The current volume is ${server.dispatcher.volume}`);
            if (Number.isNaN(messageArray[1])) return message.channel.send("That is not a number!");
            Math.floor(messageArray[1]);
            if (messageArray[1] > 10) return message.channel.send("Please specify a value between 0 and 10")

            server.volume = messageArray[1];
            server.dispatcher.setVolumeLogarithmic(messageArray[1] / 5)
            if (sendMessages) return;
            else return message.channel.send(`The Volume was changed to ${Math.floor(messageArray[1])}`)

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
        commandfile.run(bot, message, args, ops).catch((err) => {
            message.channel.send(`Error ${err}`);
            bot.logger.info(`Command Error: ${commandfile.help.name} ${err}`);
        });
    } else if (!sendMessages) {
        message.channel.send("That is no valid command!")
            .then((message) => {
                message.delete(1000).catch()
            })
    } else return;

}
module.exports.help = {
    name: "message"
};



async function play(connection, message, bot) {


    var server = servers[message.guild.id];

    if (server.queue.length < 0) return;
    if (!message.guild.me.hasPermission("SPEAK")) {
        server.queue = [];
        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        return message.channel.send("I dont have the speak permission");
    }
    server.dispatcher = await connection.playStream(YTDL(server.queue[0], {
        filter: "opus",
        liveBuffer: 60000
    }), {
        bitrate: 192000
    });
    server.dispatcher.on("error", bot.logger.error);
    let info = await YTDL.getInfo(server.queue[0]).catch();
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

    let nowPlaying = new Discord.RichEmbed()

        .setTitle("Now Playing")
        .setColor(bot.config.color)
        .setDescription(`${info.title} Requested by ${server.requester[0]}`);

    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I don\'t have the permission to send embeds");
    else message.channel.send(nowPlaying);



    server.dispatcher.on("end", async () => {
        await server.queue.shift();
        await server.requester.shift();
        if (server.queue[0]) play(connection, message, bot).catch((err) => message.channel.send(`Something went wrong ${err}`));
        else connection.disconnect();
    })
}


async function captcha(message) { // Source https://github.com/y21/discordcaptcha (modified)
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I dont have the permission to give users roles").catch();

    let captchaConfig = JSON.parse(fs.readFileSync("./datastorage/captchaConfig.json", "utf8"));

    if (!captchaConfig[message.guild.id]) {
        captchaConfig[message.guild.id] = {
            captcha: false
        };
    }

    if (captchaConfig[message.guild.id].captcha !== true) {
        return;
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
    var toVerify = message.guild.members.get(message.author.id)




    message.author.send(new Discord.RichEmbed()
        .setTitle("Verification")
        .setDescription(`${message.guild.name}is protected by DiscordCaptcha`)
        .addField("Instructions", `In a few seconds an image will be sent to you which includes a number. Please send verify <captcha> into the channel ${message.channel.name} (${message.channel})`)
        .setColor(bot.config.color)
        .setTimestamp()
    ).catch((e) => e.toString().includes("Cannot send messages to this user") ? message.reply("please turn on dms") : null);
    _image.getBuffer(jimp.MIME_PNG, async (err, buff) => {
        await message.author.send(new Discord.Attachment(buff, "captcha.jpg")).catch();


    });
    try {
        try {
            await message.channel.awaitMessages((message) => message.content == `verify ${rand}` && message.author.id == verifyAuthor.id, {
                maxMatches: 1,
                time: 60000,
                errors: ['time']
            })
        } catch (err) {
            return message.author.send("No or invalid value entered").catch()
        };
    } catch (err) {
        return message.author.send("No or invalid value entered").catch()
    };
    let role = message.guild.roles.find((r) => r.name === "member");
    await toVerify.addRole(role).catch((err) => {
            return message.channel.send(`Something went wrong: ${err}`)
        })
        .then(message.reply(`You've been verified!`))
};



function reload(bot) {
    fs.readdir(path.join(__dirname, '../../commands'), (err, files) => {


        if (err) bot.logger.info(err);

        let jsfile = files.filter((f) => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
            return;
        }
        jsfile.forEach((f, i) => {
            delete require.cache[require.resolve(`${path.join(__dirname, '../../commands')}/${f}`)]
            let probs = require(`${path.join(__dirname, '../../commands')}/${f}`);
            bot.commands.set(probs.help.name, probs);
            bot.commands.set(probs.help.alias, probs);
        });


    });
    fs.readdir(path.join(__dirname, '../activities/'), (err, files) => {

        let jsfile2 = files.filter((f2) => f2.split(".").pop() === "js")
        if (jsfile2.length <= 0) {
            return;
        }
        jsfile2.forEach((f2, i) => {
            delete require.cache[require.resolve(`${path.join(__dirname, '../activities/')}/${f2}`)]
            let probs2 = require(`${path.join(__dirname, '../activities/')}${f2}`);
            bot.activities.set(probs2.activity.name, probs2);
        })


    })
}