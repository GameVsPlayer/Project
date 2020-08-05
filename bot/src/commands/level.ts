import { Message, MessageAttachment } from "discord.js";

import Discord from "discord.js";
import jimp from "jimp";
import path from "path";
import fs from "fs";
module.exports.run = async (bot: any, message: Message) => {
    if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
    let localFile: string = path.join(__dirname + "/../pics/levelBG.jpg");
    if (!fs.existsSync(localFile)) localFile = "https://i.imgur.com/YwQjWm0.jpg";
    let _background: any = await jimp.read(localFile);
    let _font: any = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    let avatarURL: string = message.author.avatarURL({ format: 'png', dynamic: true, size: 1024 });
    let _avatar: any = await jimp.read(avatarURL);
    //return bot.logger.info(avatarURL)
    let xpDB = await bot.db.xpDB.findOne({
        userid: message.author.id
    });
    let level: number = xpDB.level;
    let xp: number = xpDB.messageCount;
    let xpForLevelUp: number = Math.floor((level * 100) * (0.5 * level));
    var username: string = "";
    username += message.author.username;
    username += "#";
    username += message.author.discriminator;
    _avatar.resize(170, 170);
    var levelProgress = `Level${level} XP ${xp}/${xpForLevelUp}`
    _background.composite(_avatar, 350, 545);
    _background.print(_font, 530, 560, username);
    _background.print(_font, 530, 640, levelProgress);
    _background.quality(80);

    _background.getBuffer(jimp.MIME_JPEG, async (err: Error, buff: Buffer) => {
        if (err) return message.channel.send(`Something went wrong ${err}`)
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("ATTACH_FILES")) {
            await message.channel.send("I do not have the permission to ATTATCH FILES").then((msg: Message) => msg.delete({ timeout: 5000 }));

        }
        else await message.channel.send(new MessageAttachment(buff, `XP_${message.author.username + "_" + message.author.discriminator}.jpg`)).catch();
    })
}
module.exports.help = {
    name: "level"
}