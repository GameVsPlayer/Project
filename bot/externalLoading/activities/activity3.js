moment = require("moment-timezone")
module.exports.run = async (bot, message, args) => {
    bot.user.setActivity(`The Time: ${moment().tz("Europe/Berlin").format("H:mm")} CEST`, {
        type: "WATCHING"
    }).catch((err) => bot.logger.error(err));
    return;
}
module.exports.activity = {
    name: 3
}