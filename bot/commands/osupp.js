const Discord = require("discord.js");
const osu = require('ojsama');

module.exports.run = async (bot, message, args) => {
    return;
    if (bot.config.osuAPI === "") return bot.logger.info("OSU API Key not set")
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")


    var mods = osu.modbits.none;
    var acc_percent;
    var combo;
    var nmiss;

    // get mods, acc, combo, misses from command line arguments
    // format: +HDDT 95% 300x 1m
    var argv = args;

    for (var i = 1; i < argv.length; ++i) {
        if (argv[i].startsWith("+")) {
            mods = osu.modbits.from_string(argv[i].slice(1) || "");
        } else if (argv[i].endsWith("%")) {
            acc_percent = parseFloat(argv[i]);
        } else if (argv[i].endsWith("x")) {
            combo = parseInt(argv[i]);
        } else if (argv[i].endsWith("m")) {
            nmiss = parseInt(argv[i]);
        }
    }

    var parser = new osu.parser();
    parser.feed_line.bind(args[0]);

    var map = parser.map;
    if (map == undefined) return message.channel.send("No map found!");
    bot.logger.info(map.toString());

    if (mods) {
        bot.logger.info("+" + osu.modbits.string(mods));
    }

    var stars = new osu.diff().calc({
        map: map,
        mods: mods
    });
    bot.logger.info(stars.toString());

    var pp = osu.ppv2({
        stars: stars,
        combo: combo,
        nmiss: nmiss,
        acc_percent: acc_percent,
    });

    var max_combo = map.max_combo();
    combo = combo || max_combo;

    bot.logger.info(pp.computed_accuracy.toString());
    bot.logger.info(combo + "/" + max_combo + "x");

    return;


    osuEmbed = new Discord.RichEmbed()
        .setTitle(`${username} osuStd`)
        .addField("PP", `${pp}`)
        .addField("Accuracy", `${accuracy}%`, true)
        .addField("Playcount", `${playcount}`, true)
        .addField("Level", `${level}`, true)
        .addField("Country", `${username} is from :flag_${country0}:`, true)
        .setThumbnail(Avatar)
        .addField("Rank", `${rank}`, true)
        .addField("Recent Activities", recentScores)
        .setDescription(`[Profile](https://osu.ppy.sh/u/${user_id})`)

    message.channel.send(osuEmbed).catch();

}
module.exports.help = {
    name: "osupp"
}