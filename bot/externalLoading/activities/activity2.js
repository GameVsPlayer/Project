module.exports.run = async (bot, message, args) => {
    bot.user.setActivity(`with ${bot.users.cache.size -1} Users`, {
        type: "PLAYING"
    }).catch((err) => bot.logger.error(err));
    return;
}
module.exports.activity = {
    name: 2
}