import { Message, MessageEmbed } from "discord.js";

import Discord from "discord.js";
import sm from "string-similarity";

module.exports.run = async (bot: any, message: Message, args: string[]) => {

    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds")

    let memberA = await bot.extra.autocomplete(message, args);

    if (await bot.db.moneyDB.findOne({
        userid: memberA.id
    }) === null) {
        const data: any = {
            userid: memberA.id,
            balance: 0,
            lastClaim: null
        }
        await bot.db.moneyDB.insertOne(data);
    }
    let balance = await bot.db.moneyDB.findOne({
        userid: memberA.id
    });
    let embed: MessageEmbed = new Discord.MessageEmbed()
        .setTitle("Balance")
        .setDescription(`<@${memberA.id}> has ${balance.balance}$`)
        .setColor(bot.config.color);

    message.channel.send(embed).catch();
}

module.exports.help = {
    name: "balance"
}