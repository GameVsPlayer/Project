const Discord = require("discord.js");
const sm = require("string-similarity");

module.exports.run = async (bot, message, args) => {

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")
    
    let memberA = await bot.extra.autocomplete(message, args);

    if (await bot.db.moneyDB.findOne({
            userid: memberA.id
        }) === null) {
        const data = {
            userid: memberA.id,
            balance: 0,
            lastClaim: null
        }
        await bot.db.moneyDB.insertOne(data);
    }
    let balance = await bot.db.moneyDB.findOne({
        userid: memberA.id
    });
    embed = new Discord.MessageEmbed()
        .setTitle("Balance")
        .setDescription(`<@${memberA.id}> has ${balance.balance}$`)
        .setColor(bot.config.color);

    message.channel.send(embed).catch();
}

module.exports.help = {
    name: "balance"
}