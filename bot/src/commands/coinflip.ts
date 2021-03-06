import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds");


    if (!args[1]) return message.reply("The correct usage is <prefix>coinflip (bet amount) Heads/Tails").catch((err: Error) => message.channel.send("Something went wrong :" + err));
    let args2: string = args[1].toLowerCase();

    if (!args[0]) return message.reply("The correct usage is <prefix>coinflip (bet amount) Heads/Tails").catch((err: Error) => message.channel.send("Something went wrong :" + err));

    if (isNaN(parseInt(args[0]))) return message.reply("That is not a number").catch((err: Error) => message.channel.send("Something went wrong :" + err));

    if (await bot.db.moneyDB.findOne({
        userid: message.author.id
    }) === null) {
        const data: object = {
            userid: message.author.id,
            balance: 0,
            lastClaim: null
        }
        await bot.db.moneyDB.insertOne(data);
    }
    let balance = await bot.db.moneyDB.findOne({
        userid: message.author.id
    });

    if (balance.balance < (Math.floor(parseInt(args[0])))) return message.reply("You do not have a high enough balance!").catch((err: Error) => message.channel.send("Something went wrong :" + err));

    if (args2 === "heads" || "tails") {

        var pick = async function () {
            var array = ["heads", "tails"];

            var picked = array[Math.floor(Math.random() * array.length)];

            return picked;

        }
        pick().then(async (a) => {
            let match: string;
            if (a === args2) {
                match = `**You guessed ${a} correctly and earned 2x of your bet balance**`
            } else match = "**You guessed wrong and lost your bet amount**";

            let embed: MessageEmbed = new Discord.MessageEmbed()

                .setTitle("**Coin Flip**")
                .addField("Result", `**${a}** \n ${match}`)
                .setColor(bot.config.color);

            await message.channel.send(embed).catch()

            if (a !== args2) {

                return await bot.db.moneyDB.findOneAndUpdate({
                    userid: message.author.id
                }, {
                    "$inc": {
                        balance: - +parseInt(args[0])
                    }
                });
            }
            if (a == args2) {

                await bot.db.moneyDB.findOneAndUpdate({
                    userid: message.author.id
                }, {
                    "$inc": {
                        balance: parseInt(args[0])
                    }
                });
            }
        })
    } else return message.reply("Please enter heads or tails")
}

module.exports.help = {
    name: "coinflip"
}