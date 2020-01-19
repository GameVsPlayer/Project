const superagent = require("superagent");
module.exports.run = async (bot, message, args) => {
    index = Math.floor(Math.random(2000) * 1)


    if (message.channel.nsfw === false) return message.channel.send("This channel is not marked as a nsfw channel!").catch();

    var site = [`https://konachan.com/`,
        `https://yande.re/`
    ]

    var siteChoose = site[Math.floor(Math.random() * site.length)];

    if (siteChoose == "https://konachan.com/") index = Math.floor((Math.random() * 600) + 1)
    else index = Math.floor((Math.random() * 1700) + 1)

    let {
        body
    } = await superagent
        .get(`${siteChoose}post.json?limit=100&page=${index}&tags=-rating:safe`).catch((err) => {
            return message.channel.send(`Something went wrong: ${err}`)
        });


    if (!body[0]) return
    var indexA = body[Math.floor(Math.random() * body.length)];
    var fullURL = `${siteChoose}post/show/${indexA.id}`
    message.channel.send(`${indexA.sample_url} [Post] <${fullURL}>`).catch();

}
module.exports.help = {
    name: "nsfw"
}