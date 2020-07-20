const Discord = require("discord.js");
const sm = require("string-similarity");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    let members = [];
    let indexes = [];
    message.guild.members.forEach((member) => {
        members.push(member.user.username);
        indexes.push(member.id);
    })

    let match = sm.findBestMatch(args.join(' '), members);

    let username = match.bestMatch.target;

    let member = message.guild.members.fetch(indexes[members.indexOf(username)]);

    let user = message.guild.member(message.mentions.users.first()) || member;



    if (await bot.db.moneyDB.findOne({
            userid: user.id
        }) === null) {
        const data = {
            userid: user.id,
            balance: 0,
            lastClaim: null
        }
        await bot.db.moneyDB.insertOne(data);
    }
    let balance = await bot.db.moneyDB.findOne({
        userid: user.id
    });
    embed = new Discord.MessageEmbed()
        .setTitle("Balance")
        .setDescription(`<@${user.id}> has ${balance.balance}$`)
        .setColor(bot.config.color);

    message.channel.send(embed).catch();
}

module.exports.help = {
    name: "balance"
}