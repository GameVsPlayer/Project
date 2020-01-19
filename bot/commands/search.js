const search = require("yt-search");
module.exports.run = async (bot, message, args, ops) => {


    search(args.join(' '), function (err, res) {
        if (err) return message.channel.send("Sorry Something went wrong!").catch();
        else {
            let videos = res.videos.slice(0, 5);

            let resp = '';

            for (var i in videos) {
                resp += `**[${parseInt(i)+1}]:** \`${videos[i].title}\`\n`;

            }
            resp += `\n**Choose a number between \`1-${videos.length}\`**`;

            message.channel.send(resp);

            const filter = (m) => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;

            const collector = message.channel.createMessageCollector(filter);

            collector.videos = videos;
            collector.once('collect', function (m) {
                let commandfile = require(`./play.js`);
                commandfile.run(bot, message, [collector.videos[parseInt(m.content) - 1].url], ops).catch();
            });
        };
    });
}

module.exports.help = {
    name: "search"
}