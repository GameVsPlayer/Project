const sm = require("string-similarity");

module.exports = {
    autocomplete: async function(message, args) {
let memberA;

if (args[0]) {
    if (await message.mentions.users.first() != undefined) {

        let username = message.mentions.users.first();

        memberA = username.id;
    }
    if (!memberA) {

        let members = [];
        let indexes = [];

        let GuildMembers = await message.guild.members.fetch()
          
        GuildMembers.forEach((member) => {
            members.push(member.displayName);
            indexes.push(member.id);
        })
    
        let match = sm.findBestMatch(args.join(' '), members);

        let username = match.bestMatch.target;

        global.autocomplete = await message.guild.members.fetch(indexes[members.indexOf(username)]);
    }
} else {
    memberA = message.author;
}
memberA = memberA || global.autocomplete || message.author;
if (!memberA) return message.reply("No user found.").catch((err) => bot.logger.error(err));

memberA = await message.guild.members.fetch(memberA.userID || memberA);

    return memberA;
}
}