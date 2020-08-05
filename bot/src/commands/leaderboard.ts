import { Message } from "discord.js";

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    let a: Array<any> = [];
    await bot.db.xpDB.find().sort({
        messageCount: -1
    }).limit(10).forEach((item: object) => a.push(item));

    let index: number = 0;
    let names: Array<any> = [];
    for (let i: number = 0; i < a.length; i++) {
        let gotID = await bot.users.fetch(a[i].userid).catch((err: Error) => { });
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