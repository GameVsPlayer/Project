module.exports.run = async (bot, message, args) => {
    bot.user.setActivity(`on ${bot.guilds.size} Servers`, {
        type: "PLAYING"
    }).catch((err) => console.error(err));
    return;
}

module.exports.activity = {
    name: 1
};