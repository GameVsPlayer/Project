module.exports.run = async (bot, message, args) => {
    bot.user.setActivity("Gamu.tk", {
        type: "WATCHING"
    }).catch((err) => console.error(err));
    return;
}
module.exports.activity = {
    name: 4
}