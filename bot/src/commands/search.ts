import { Message } from "discord.js";

import search from "yt-search";
module.exports.run = async (bot: any, message: Message, args: string[], ops: any) => {

    if (!args[0]) return message.channel.send("No song has been entered");
    search(args.join(' '), function (err: Error, res: any) {

        if (err) return message.channel.send("Sorry Something went wrong!").catch();
        else {
            let videos = res.videos.slice(0, 5);

            let resp: string = '';

            for (let i in videos) {
                resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;

            }
            resp += `\n**Choose a number between \`1-${videos.length}\`**`;

            message.channel.send(resp);

            const filter = (m: any) => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;

            const collector = message.channel.createMessageCollector(filter);

            collector.once('collect', function (m: any) {
                let commandfile = require(`./play.js`);
                commandfile.run(bot, message, [videos[parseInt(m.content) - 1].url], ops).catch();
            });
        };
    });
}

module.exports.help = {
    name: "search"
}