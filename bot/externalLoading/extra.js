const sm = require("string-similarity");

module.exports = {
    autocomplete: async function (message, args) {
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
    },
    getPrefix: function (bot, guild, callback) {
        db = bot.db.prefixes;
        redis = bot.redis;
        redis.hgetall(guild.id + ".prefix", function (err, reply) {
            if (err) callback(err);
            else if (reply) {
                callback(JSON.parse(reply));
            }
            else {
                db.findOne({
                    guildID: guild.id
                }, function (err, doc) {
                    if (err) callback(err);
                    else if (!doc) {
                        const data = {
                            guildID: message.guild.id,
                            prefix: bot.prefix
                        }
                        db.insertOne(data);
                        redis.set(guild.id +".prefix", bot.prefix, function () {
                            return callback(bot.prefix);
                        });
                    }
                    else {
                        redis.set(guild.id +".prefix", doc.prefix, function () {
                            return callback(doc.prefix);
                    }
                )};

                });
            }
        });
    },
    setPrefix: function (bot, guild, prefix) {
        db = bot.db.prefixes;
        redis = bot.redis;

        db.findOneAndUpdate({
            guildID: guild.id
        }, {
            "$set": {
                prefix: prefix
            }
        });
        redis.set(guild.id +".prefix", prefix, function () {
            return;
        });
    }
}