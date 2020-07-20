const Discord = require("discord.js");
const jimp = require("jimp");
const path = require("path");
const fs = require("fs");
module.exports.run = async (bot, message) => {
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    let localFile = path.join(__dirname + "/../pics/levelBG.jpg");
    if (!fs.existsSync(localFile)) localFile = "https://i.imgur.com/YwQjWm0.jpg";
    let _background = await jimp.read(localFile);
    let _font = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    let avatarURL = message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 });
    let _avatar = await jimp.read(avatarURL);
    //return bot.logger.info(avatarURL)
    let xpDB = await bot.db.xpDB.findOne({
        userid: message.author.id
    });
    let level = xpDB.level;
    let xp = xpDB.messageCount;
    let xpForLevelUp = Math.floor((level * 100) * (0.5 * level));
    var username = "";
    username += message.author.username;
    username += "#";
    username += message.author.discriminator;
    _avatar.resize(170, 170);
    var levelProgress = `Level${level} XP ${xp}/${xpForLevelUp}`
    _background.composite(_avatar, 350, 545);
    _background.print(_font, 530, 560, username);
    _background.print(_font, 530, 640, levelProgress);
    _background.quality(80);

    _background.getBuffer(jimp.MIME_JPEG, async (err, buff) => {
        if (err) return message.channel.send(`Something went wrong ${err}`)
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("ATTACH_FILES")) return message.channel.send("I do not have the permission to ATTATCH FILES").delete(5000);
        await message.channel.send(new Discord.Attachment(buff, `XP_${message.author.username+"_"+message.author.discriminator}.jpg`)).catch();
    })
}
module.exports.help = {
    name: "level"
}