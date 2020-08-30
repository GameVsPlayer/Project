import { Message, MessageEmbed, User } from "discord.js";

import Discord from "discord.js";

var kissURL: string[] = [
    "http://i.imgur.com/he7ZeCQ.gif",
    "http://i.imgur.com/EmTTpln.gif",
    "https://media.giphy.com/media/mGAzm47irxEpG/giphy.gif",
    "https://media.giphy.com/media/gDAaru13sdEK4/giphy.gif",
    "https://media.giphy.com/media/vUrwEOLtBUnJe/giphy.gif",
    "https://i.imgur.com/MLDPssw.gif",
    "https://media.giphy.com/media/FCxQXh8GcvRxC/giphy.gif",
    "http://i.imgur.com/ebzT2ne.gif",
    "http://i.imgur.com/mTCgMcD.gif",
    "http://i.imgur.com/C76L9Ms.gif",
    "https://i.imgur.com/HJCUmgF.gif",
    "http://i.imgur.com/Nhqy9gK.gif",
    "https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif",
    "https://media.giphy.com/media/bm2O3nXTcKJeU/giphy.gif",
    "https://media.giphy.com/media/wOtkVwroA6yzK/giphy.gif",
    "https://media.giphy.com/media/10r6oEoT6dk7E4/giphy.gif",
    "https://media.giphy.com/media/2FfCQFV28HMn6/giphy.gif",
    "https://media.giphy.com/media/mQfEYYd90AXJK/giphy.gif",
    "https://media.giphy.com/media/QGc8RgRvMonFm/giphy.gif",
    "https://media.giphy.com/media/Q1TXCgzvfLNbW/giphy.gif"

];

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");
    if (!args[0]) return message.reply("Please mention a user!").then((msg) => msg.delete({ timeout: 5000 }).catch());


    let kissUser: User = await bot.extra.autocomplete(bot, message, args);

    if (kissUser.id == message.author.id) return message.channel.send("You can\'t kiss yourself")

    if (await bot.db.kissDB.findOne({
        userid: kissUser.id
    }) === null) {
        const data: object = {
            userid: kissUser.id,
            amount: 0
        }
        await bot.db.kissDB.insertOne(data);
    }
    await bot.db.kissDB.findOneAndUpdate({
        userid: kissUser.id
    }, {
        "$inc": {
            amount: 1
        }
    });
    const kiss = await bot.db.kissDB.findOne({
        userid: kissUser.id
    })

    var gif: number = Math.floor(Math.random() * (kissURL.length - 1) + 1);
    let kissEmbed: MessageEmbed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .addField("Kisses", `${kissUser} has been kissed by ${message.member}`)
        .addField("Number of kisses that they have received", kiss.amount)
        .setImage(kissURL[gif]);
    return message.channel.send(kissEmbed).catch();
}
module.exports.help = {
    name: "kiss"
}