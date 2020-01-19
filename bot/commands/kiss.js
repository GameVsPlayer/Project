const Discord = require("discord.js");
const sm = require("string-similarity");

var kissURL = [
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

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");
    if (!args[0]) return message.reply("Please mention a user!").then((msg) => msg.delete(5000).catch());


    let members = [];
    let indexes = [];
    message.guild.members.forEach((member) => {
        members.push(member.user.username);
        indexes.push(member.id);
    })

    let match = sm.findBestMatch(args.join(' '), members);

    let username = match.bestMatch.target;

    let member = message.guild.members.get(indexes[members.indexOf(username)]);

    let kissUser = message.guild.member(message.mentions.users.first()) || member;
    if (!kissUser) return message.reply("No user could be found!").then((msg) => msg.delete(5000).catch());

    if (kissUser.id == message.author.id) return message.channel.send("You can\'t kiss yourself")

    if (await bot.db.kissDB.findOne({
            userid: kissUser.id
        }) == null) {
        const data = {
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

    var gif = Math.floor(Math.random() * (kissURL.length - 1) + 1);
    let kissEmbed = new Discord.RichEmbed()
        .setColor(bot.color)
        .addField("Kisses", `${kissUser} has been kissed by ${message.member}`)
        .addField("Number of kisses that they have received", kiss.amount)
        .setImage(kissURL[gif]);
    return message.channel.send(kissEmbed).catch();
}
module.exports.help = {
    name: "kiss"
}