module.exports.run = async (bot, message, args) => {
    bot.user.setActivity(`with ${bot.users.size -1} Users`, {
        type: "PLAYING"
    }).catch((err) => console.error(err));
    return;
}
module.exports.activity = {
    name: 2
}