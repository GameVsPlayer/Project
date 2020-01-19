const ms = require("parse-ms");

module.exports.run = async (bot, message, args) => {


    let cooldown = 8.64e+7,
        amount = 400;

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
    let lastDaily = balance.lastClaim;

    if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
        let timeObj = ms(cooldown - (Date.now() - lastDaily));

        message.channel.send(`You already collected this, please wait **${timeObj.hours}h ${timeObj.minutes}m**!`).catch();
    } else {
        message.channel.send(`Successfully collected $${amount}`).catch();

        bot.db.moneyDB.findOneAndUpdate({
            userid: message.author.id
        }, {
            "$set": {
                lastClaim: Date.now()
            },
            "$inc": {
                balance: amount
            }
        });
    }

}

module.exports.help = {
    name: "daily"
};