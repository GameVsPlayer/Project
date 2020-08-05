import { Message, Channel, TextChannel, GuildChannel } from "discord.js";

const superagent = require("superagent");
module.exports.run = async (bot: any, message: Message, args: string[]) => {
    let index: number = Math.floor(Math.random() * 2000)

    let Channel: TextChannel = await bot.channels.get(message.channel.id)

    if (!Channel.nsfw) return message.channel.send("This channel is not marked as a nsfw channel!").catch();

    var site = [`https://konachan.com/`,
        `https://yande.re/`
    ]

    let siteChoose: string = site[Math.floor(Math.random() * site.length)];

    if (siteChoose == "https://konachan.com/") index = Math.floor((Math.random() * 600) + 1)
    else index = Math.floor((Math.random() * 1700) + 1)

    let {
        body
    } = await superagent
        .get(`${siteChoose}post.json?limit=100&page=${index}&tags=-rating:safe`).catch((err: Error) => {
            return message.channel.send(`Something went wrong: ${err}`)
        });


    if (!body[0]) return
    let indexA: any = body[Math.floor(Math.random() * body.length)];
    let fullURL: string = `${siteChoose}post/show/${indexA.id}`
    message.channel.send(`${indexA.sample_url} [Post] <${fullURL}>`).catch();

}
module.exports.help = {
    name: "nsfw"
}