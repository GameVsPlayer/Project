import { MessageEmbed, Message, User } from "discord.js";

import Discord from "discord.js";

let hugURL: string[] = [
    "https://i.imgur.com/RNPzj5c.gif",
    "http://i.imgur.com/ZGIgnCo.gif",
    "http://i.imgur.com/Fac1s30.gif",
    "http://i.imgur.com/G2BVJBq.gif",
    "http://i.imgur.com/neN603k.gif",
    "http://i.imgur.com/2T9NyVA.gif",
    "http://i.imgur.com/clsKIja.gif",
    "https://i.imgur.com/Xv6lIpb.gif",
    "http://i.imgur.com/oBwQ43q.gif",
    "http://i.imgur.com/6sg67Vd.gif",
    "http://i.imgur.com/tmlnrZy.gif",
    "http://i.imgur.com/M6CDZxa.gif",
    "http://i.imgur.com/ImZ7kBT.gif",
    "http://i.imgur.com/ktvxVMG.gif",
    "https://i.imgur.com/2EYoVuL.gif"

];

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.reply("Please mention a user!").then((msg) => msg.delete({ timeout: 5000 }).catch());

    let hugUser: User = await bot.extra.autocomplete(message, args);

    if (hugUser.id == message.author.id) return message.channel.send("You can\'t hug yourself")

    if (await bot.db.hugsDB.findOne({
        userid: hugUser.id
    }) === null) {
        const data: object = {
            userid: hugUser.id,
            amount: 0
        }
        await bot.db.hugsDB.insertOne(data);
    }

    await bot.db.hugsDB.findOneAndUpdate({
        userid: hugUser.id
    }, {
        "$inc": {
            amount: 1
        }
    });
    const hug = await bot.db.hugsDB.findOne({
        userid: hugUser.id
    })
    const gif: number = Math.floor(Math.random() * (hugURL.length - 1) + 1);
    let hugEmbed = new Discord.MessageEmbed()
        .setColor(bot.config.color)
        .addField("Hugs", `${hugUser} has been hugged by ${message.member}`)
        .addField("Number of Hugs that they have received", hug.amount)
        .setImage(hugURL[gif]);


    return message.channel.send(hugEmbed).catch();
}
module.exports.help = {
    name: "hug"
}