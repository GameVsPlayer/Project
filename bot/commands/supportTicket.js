let channel;

module.exports.run = async (bot, message, args) => {
    return;
    if (message.channel.type != "dm") return
    let guild = await bot.guilds.get(bot.config.ownerServerID)
    if (!guild.me.hasPermission("MANAGE_CHANNELS")) return


    var found = guild.channels.find(function (channel) {

        return console.log(channel.name == message.author.id)
    });

    console.log(found)

    if (found == null) {
        channel = await guild.createChannel(`ID${message.author.id}`, "text").catch();
        await channel.setParent('486176833134657537').catch();
    } else channel = guild.channels.find(`ID${message.author.id}`);

    //channel.send(`Test Error ${(message.content).splice(1)}`)



}
module.exports.help = {
    name: "support"
}