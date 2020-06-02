module.exports.run = async (bot, message, args) => {
    bot.user.setActivity("Gamu.tk", {
        type: "WATCHING"
    }).catch((err) => bot.logger.error(err));
    return;
}
module.exports.activity = {
    name: 4
}