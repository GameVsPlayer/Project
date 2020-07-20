const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    if (!args[0]) return message.reply("Please enter a number").catch((err) => message.channel.send("Something went wrong :" + err));

    if (IsNaN(args[0])) return message.reply("That is not a number").catch((err) => message.channel.send("Something went wrong :" + err));

    if (await bot.db.moneyDB.findOne({
            userid: message.author.id
        }) === null) {
        const data = {
            userid: message.author.id,
            balance: 0,
            lastClaim: null
        }
        await bot.db.moneyDB.insertOne(data);
    }
    let balance = await bot.db.moneyDB.findOne({
        userid: message.author.id
    });

    if (balance.balance < (Math.floor(args[0]))) return message.reply("You do not have a high enough balance!").catch((err) => message.channel.send("Something went wrong :" + err));

    var pick = async function () {
        var array = ["❌", "🎉"];

        var picked = array[Math.floor(Math.random() * array.length)];

        return picked;

    }


    pick().then(async (a) => {

        pick().then(async (b) => {

            pick().then(async (c) => {



                if (a == b && a == c) {
                    match = "Match"
                } else match = "No match";

                embed = new Discord.MessageEmbed()

                    .setTitle("**Slots**")
                    .addField("Rolls", a + " " + b + " " + c)
                    .setFooter(match)
                    .setColor(bot.config.color)
                    .addField("Money before", balance.balance)





                if (a != b || a != c) {

                    await bot.db.moneyDB.findOneAndUpdate({
                        userid: message.author.id
                    }, {
                        "$inc": {
                            balance: - +args[0]
                        }
                    });
                }

                if (a == b && b == c) {

                    if (a == "❌") {
                        message.channel.send(`You got a ${a} which means that you will get all of your bet balance back`).catch();
                    }
                    /* if (a == "💰") {
                        await db.subtract(`userBalance_${message.author.id}`, args[0])
                        await db.add(`userBalance_${message.author.id}`, Math.floor(args[0] * 1.5))
                        return message.channel.send(`You got a ${a} which means you get 1.5x your set balance`).catch()
                    }
*/
                    if (a == "🎉") {
                        await bot.db.moneyDB.findOneAndUpdate({
                            userid: message.author.id
                        }, {
                            "$inc": {
                                balance: args[0] * 3
                            }
                        });
                        message.channel.send(`You got a ${a} which means you get 4x your set balance`).catch();
                    }
                    /* if (a == "🍹") {
                         
                         await db.subtract(`userBalance_${message.author.id}`, args[0])
                         await db.add(`userBalance_${message.author.id}`, Math.floor(args[0] * 1.25))
                         return message.channel.send(`You got a ${a} which means you get 1.25x your set balance`).catch()
                     }*/

                }
                embed.addField("Money after", (await bot.db.moneyDB.findOne({
                    userid: message.author.id
                })).balance);
                return await message.channel.send(embed).catch();



            })
        })
    })
}

module.exports.help = {
    name: "slots"
}