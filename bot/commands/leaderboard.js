module.exports.run = async (bot, message, args) => {
    a = [];
    await bot.db.xpDB.find().sort({
        messageCount: -1
    }).limit(10).forEach((item) => a.push(item));

    let index = 0;
    let names = [];
    for (i = 0; i < a.length; i++) {
        let gotID = await bot.users.fetch(a[i].userid).catch(err => {});
        if (gotID === undefined) {
            names.push({
                name: 'unknown',
                mes: a[i].messageCount,
                level: a[i].level
            });
        } else {


            names.push({
                name: gotID.username + "#" + gotID.discriminator,
                mes: a[i].messageCount,
                level: a[i].level
            });
        }
    }
    return message.channel.send(`${names.map((sorted2) => `**${++index}**. User: ${sorted2.name} Messages sent: ${sorted2.mes} Level: ${sorted2.level}`).join('\n')}`)
}
module.exports.help = {
    name: "leaderboard",
    alias: "lb"
}