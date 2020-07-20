const Discord = require("discord.js");
const superagent = require("superagent");
module.exports.run = async (bot, message, args) => {
    if (bot.config.osuAPI === "") return bot.logger.info("osu! API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.channel.send("No user specified").catch();
    usernameRequst = args[0].toString();
    var url = `https://osu.ppy.sh/api/get_user?u=${usernameRequst}&k=${bot.config.osuAPI}&m=2&type=string`
    let {
        body
    } = await superagent
        .get(url).catch((err) => {
            return message.channel.send(`Something went wrong: ${err}`)
        })
    if (!body[0]) return message.reply("That user could not be found!").catch();
    country0 = body[0].country;
    country = country0.toLowerCase();
    countryFlag = `:flag_${country}:`;
    pp = parseFloat(body[0].pp_raw).toFixed(0)
    level = parseFloat(body[0].level).toFixed(2);
    rank = body[0].pp_rank;
    playcount = body[0].playcount;
    username = body[0].username;
    accuracy = parseFloat(body[0].accuracy).toFixed(2);
    user_id = body[0].user_id;
    Avatar = `https://s.ppy.sh/a/${user_id}`
    if (body[0].pp_raw = NaN) return message.reply("No Data for that user found").catch();

    osuEmbed = new Discord.MessageEmbed()
        .setTitle(`**${username} osuCtB**`)
        .addField("PP", `${pp}`)
        .addField("Accuracy", `${accuracy}%`, true)
        .addField("Playcount", `${playcount}`, true)
        .addField("Level", `${level}`, true)
        .addField("Rank", `${rank}`, true)
        .setFooter(`${username} is from ${country0}`)
        .setThumbnail(Avatar);

    message.channel.send(osuEmbed).catch();
}
module.exports.help = {
    name: "ctb"
}