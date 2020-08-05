import { Message } from "discord.js";

import Discord from "discord.js";


var hpURL: string[] = [
    "https://media.giphy.com/media/ARSp9T7wwxNcs/giphy.gif",
    "https://media.giphy.com/media/3ov9jJ1cL9WxsaHhUA/giphy.gif",
    "https://media.giphy.com/media/L2z7dnOduqEow/giphy.gif",
    "https://media.giphy.com/media/3ov9jSFsCGZmPTKbOo/giphy.gif",
    "https://media.giphy.com/media/69zF0Y8Yv1LRT9PKHQ/giphy.gif",
    "https://media.giphy.com/media/3ov9k6OoYNND3e6kJW/giphy.gif",
    "https://media.giphy.com/media/ye7OTQgwmVuVy/giphy.gif",
    "https://media.giphy.com/media/lZnEy2UefUZvq/giphy.gif",
    "https://media.giphy.com/media/l378zfRVIGZM4Mzmw/giphy.gif",
    "https://media.giphy.com/media/osYdfUptPqV0s/giphy.gif",
    "https://media.giphy.com/media/SvQ7tWn8zeY2k/giphy.gif"
];

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.reply("Please mention a user!").then((msg: Message) => msg.delete({ timeout: 5000 }).catch());

    let hpUser = bot.extra.autocomplete(message, args);

    if (hpUser.id == message.author.id) return message.channel.send("You can\'t pat yourself")

    if (await bot.db.patsDB.findOne({
        userid: hpUser.id
    }) === null) {
        const data: object = {
            userid: hpUser.id,
            amount: 0
        }
        await bot.db.patsDB.insertOne(data);
    }
    await bot.db.patsDB.findOneAndUpdate({
        userid: hpUser.id
    }, {
        "$inc": {
            amount: 1
        }
    });
    const headpat = await bot.db.patsDB.findOne({
        userid: hpUser.id
    })

    let gif: number = Math.floor(Math.random() * (hpURL.length - 1) + 1);
    let headpatEmbed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .addField("Headpats", `<@${hpUser.id}> has been headpatted by ${message.member}`)
        .addField("Number of Headpats that they have received", headpat.amount)
        .setImage(hpURL[gif]);


    return message.channel.send(headpatEmbed).catch();
}
module.exports.help = {
    name: "headpat",
    alias: "pat"
}