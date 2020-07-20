const Discord = require("discord.js");
const sm = require("string-similarity");

let hugURL = [
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

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    if (!args[0]) return message.reply("Please mention a user!").then((msg) => msg.delete(5000).catch());

    let members = [];
    let indexes = [];
    message.guild.members.forEach((member) => {
        members.push(member.user.username);
        indexes.push(member.id);
    })

    let match = sm.findBestMatch(args.join(' '), members);

    let username = match.bestMatch.target;

    let member = message.guild.members.fetch(indexes[members.indexOf(username)]);

    let hugUser = message.guild.member(message.mentions.users.first()) || member;
    if (!hugUser) return message.reply("No user could be found!").then((msg) => msg.delete(5000).catch());

    if (hugUser.id == message.author.id) return message.channel.send("You can\'t hug yourself")

    if (await bot.db.hugsDB.findOne({
            userid: hugUser.id
        }) === null) {
        const data = {
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
    var gif = Math.floor(Math.random() * (hugURL.length - 1) + 1);
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