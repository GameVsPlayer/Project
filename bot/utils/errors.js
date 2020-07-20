const Discord = require("discord.js");

module.exports.noPerms = (message, perm) => {
    let embed = new Discord.MessageEmbed()
    .setAuthor(message.author.username)
    .setTitle("No PERMS")
    .setColor(config.color)
    .addField("Insufficent permission", perm);
      
    message.channel.send(embed)((m) => m.delete(5000));
}
