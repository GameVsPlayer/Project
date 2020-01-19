let objectIDCheck = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
module.exports.run = async (bot, message, args) => {
    if (message.channel.type != "dm") return
    message.content = message.content.split(" ");

    let sliced = message.content.slice(1);
    bot.db.todoDB.deleteMany({
        "Category": null
    });

    sliced = sliced.join(" ");
    let content = message.content.slice(4).join(" ");
    if (sliced.length === 0) return message.channel.send("no type was entered");
    if (!sliced[1]) return message.channel.send("No message status was entered");
    if (!sliced[2]) return message.channel.send("No message content was entered");


    if (message.content[1] === "add") {
        if (!sliced[2]) return message.channel.send("No message Category was entered");
        const data = {
            "status": message.content[2].toLowerCase(),
            "content": content,
            "Date": Date.now(),
            "Change": null,
            "Category": message.content[3]
        }
        await bot.db.todoDB.insertOne(data)
        return message.channel.send(`Successfully added with id ${e.ops[o]._id}`);
    }
    content = message.content.slice(4).join(" ");
    let id = message.content.slice(2, 3)
    if (sliced[0] === 'delete') {
        if (!id.match(objectIDCheck)) return message.channel.send("That is not a valid id");
        if (await bot.db.todoDB.findOne({
                _id: id
            }) == null) {
            return message.channel.send("That is not a ID that is currently in use!");
        } else {
            await bot.db.todoDB.deleteOne({
                _id: id
            }).then(e => {
                return message.channel.send(`Successfully deleted id ${e.ops[o]._id}`)
            });
        }
    }

    if (sliced[0] === 'complete') {
        if (!id.match(objectIDCheck)) return message.channel.send("That is not a valid id");
        if (await bot.db.todoDB.findOne({
                _id: id
            }) == null) {
            return message.channel.send("That is not a ID that is currently in use!");
        } else {
            await bot.db.todoDB.findOneAndUpdate({
                _id: id
            }, {
                "status": 'completed',
                "Change": Date.now()
            }).then(e => {
                return message.channel.send(`Successfully changed status to completed of id ${e.ops[o]._id}`)
            });
        }
    }
    if (sliced[0] === 'change') {
        if (!id.match(objectIDCheck)) return message.channel.send("That is not a valid id");
        if (!content) return message.channel.send("No updated value was entered");
        if (await bot.db.todoDB.findOne({
                _id: id
            }) == null) {
            return message.channel.send("That is not a ID that is currently in use!");
        } else {
            await bot.db.todoDB.findOneAndUpdate({
                _id: id
            }, {
                "status": message.content[3],
                "content": content,
                "Change": Date.now()
            }).then(e => {
                return message.channel.send(`Successfully changed id ${e.ops[o]._id}`)
            });
        }
    }


}
module.exports.help = {
    name: "todo"
}