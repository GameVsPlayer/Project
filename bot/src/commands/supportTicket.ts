import { Message, Channel, GuildChannel } from "discord.js";

let channel;

module.exports.run = async (bot: any, message: Message, args: string[]) => {
    return;
    if (message.channel.type !== "dm") return
    let guild = await bot.guilds.get(bot.config.ownerServerID)
    if (!guild.me.hasPermission("MANAGE_CHANNELS")) return


    var found = guild.channels.find(function (channel: GuildChannel) {

        return bot.logger.info(channel.name == message.author.id)
    });

    bot.logger.info(found)

    if (found === null) {
        channel = await guild.createChannel(`ID${message.author.id}`, "text").catch();
        await channel.setParent('486176833134657537').catch();
    } else channel = guild.channels.find(`ID${message.author.id}`);

    //channel.send(`Test Error ${(message.content).splice(1)}`)



}
module.exports.help = {
    name: "support"
}