module.exports.run = async (bot, message, args) => {
    let xp = await bot.db.xpDB.findOne({
        userid: message.author.id
    });
    message.channel.send('Messages send: `' + xp.messageCount + '`\nLevel: `' + (xp.level) + '`').catch();
}
module.exports.help = {
    name: "messages",
    alias: "msgs"
}