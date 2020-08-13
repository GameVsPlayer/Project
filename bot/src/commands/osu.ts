import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";

const stripTags = require("striptags");
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeago = new TimeAgo('en-us');
module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (bot.config.osuAPI == "") return bot.logger.info("OSU API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let usernameRequest: any = [];
    let gamemode: string, prefix: string;
    let start = false;
    for (let i in args) {
        if (args[i].startsWith('"') || args[i].startsWith("'")) {
            start = true
            usernameRequest.push(args[i]);
            start = false;
        } else if ((args[i].endsWith('"') || args[i].endsWith("'")) && start === false) {
            usernameRequest.push(args[i])
            break;
        } else {
            usernameRequest.push(args[i]);
            break;
        }
    }

    let argsShift = usernameRequest.length;
    usernameRequest = usernameRequest.join(" ");
    usernameRequest = usernameRequest.replace(/'/g, '')
    usernameRequest = usernameRequest.replace(/"/g, "")
    if (args[argsShift]) args = args.slice(argsShift);
    for (let i in args) {
        if (args[i].includes("-t"))
            gamemode = "taiko"
        else if (args[i].includes("-m"))
            gamemode = "mania"
        else if (args[i].includes("-c"))
            gamemode = "catch"
        else
            gamemode = "osu"
    }

    if (usernameRequest.length < 3) {
        await new Promise(function (resolve, reject) {
            bot.extra.osu.getDbUser(bot, message, function (name: any) {
                if (name === null) usernameRequest = '';
                else {
                    usernameRequest = name.gameID;
                    if (!gamemode) gamemode = name.gamemode
                }
                resolve();
            });

        })
    }
    await new Promise(function (resolve, reject) {
        bot.extra.getPrefix(bot, message.guild, function (prefixCB: string) {
            prefix = prefixCB;
            resolve();
        });

    })

    if (usernameRequest.length < 3) return message.channel.send(`You must first set a user with ${prefix}os "username"`);

    let player = await bot.extra.osu.player(bot, usernameRequest, gamemode)
    if (!player) return message.reply("That user could not be found!").catch();
    const country0: string = player.country;
    const country: string = country0.toLowerCase();
    const countryFlag: string = `:flag_${country}:`;
    const pp: string = parseFloat(player.pp_raw).toFixed(0)
    const level: string = parseFloat(player.level).toFixed(2);
    const rank: number = player.pp_rank;
    const playcount: number = player.playcount;
    const username: string = player.username;
    const accuracy: string = parseFloat(player.accuracy).toFixed(2);
    const user_id: number = player.user_id;
    const Avatar: string = `https://s.ppy.sh/a/${user_id}`
    if (isNaN(player.pp_raw)) return message.reply("No Data for that user found").catch();

    let osuBeatMapUrl: string = "https://osu.ppy.sh/beatmapsets/"
    let recentScoresArray: Array<any> = [];
    let events: Array<any> = player.events;
    if (isNaN(player.pp_raw)) return message.reply("No Data for that user found").catch();

    for (let i = 0; i < (player.events).length && i < 2; i++) {
        var display_event = stripTags(events[i].display_html);


        if (display_event.includes("osu!supporter")) recentScoresArray.push({
            name: display_event.replace(`${username} achieved`, ''),
            url: "https://osu.ppy.sh/home/support",
            date: timeago.format(new Date(events[i].date))
        })
        else if (display_event.includes("medal")) recentScoresArray.push({
            name: display_event.replace(`${username} achieved`, ''),
            url: "",
            date: timeago.format(new Date(events[i].date))
        })

        else if (display_event.includes(gamemode)) {
            recentScoresArray.push({
                name: display_event.replace(`${username} achieved`, ''),
                url: osuBeatMapUrl + events[i].beatmapset_id + "/#osu/" + events[i].beatmap_id,
                date: timeago.format(new Date(events[i].date))
            })
        }
    }
    if (recentScoresArray.length < 1) {
        var recentScores = "None";

    } else if (recentScoresArray.length < 2) {
        var recentScores = `[${recentScoresArray[0].name}](${recentScoresArray[0].url}) ${recentScoresArray[0].date}`;
    } else if (recentScoresArray.length >= 2) {
        var recentScores = `[${recentScoresArray[0].name}](${recentScoresArray[0].url}) ${recentScoresArray[0].date}
        [${recentScoresArray[1].name}](${recentScoresArray[1].url}) ${recentScoresArray[1].date}`;
    }

    const osuEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setDescription(`[${username}](https://osu.ppy.sh/u/${user_id}) has ${pp}pp in ${gamemode} with an average Accuracy of ${accuracy}%\n` +
            `this was achieved with a playcount of ${playcount}\n` +
            `The current level is ${level}\n` +
            `${username} is from :flag_${country}:\n` +
            `The current rank is ${rank}\n` +
            `Their recent activities are \n` +
            `${recentScores}`)
        .setThumbnail(Avatar)

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "osu"
}