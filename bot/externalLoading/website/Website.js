const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);;
const helmet = require('helmet');
let dbData = [];
let todos = {};

module.exports.run = async (bot) => {
    let find = bot.db.todoDB.find();
    setTimeout(async () => {
        find.each(function (err, item) {
            if (item == null) return;
            dbData.push(item);
            todos.data = dbData;
        })
    }, 1000)
    setInterval(async () => {
        dbData = [];
        find.each(function (err, item) {
            if (item == null) return;
            dbData.push(item);
            todos.data = dbData;
        })
    }, 60000);
    app.use(helmet());
    let pushData;
    setInterval(() => {
        pushData = {
            stats: {
                users: bot.users.size,
                servers: bot.guilds.size,
                cpuUsage: bot.stats.usage.cpuUsage,
                uptime: bot.fullUptime,
                usage: bot.usage,
                botid: bot.user.id,
            },
            server: {
                list: bot.serverList
            },
            todo: {
                todos: todos.data
            }
        };
    }, 1000);

    app.get('/api/', (req, res) => {
        if (ip(req) === '127.0.0.1' || ip(req) === '::1' || ip(req) === '::ffff:127.0.0.1') {
            res.json(pushData || {
                error: 'no Data available'
            });
        } else return;
    });

    httpServer.listen(process.env.BotPORT || 1025);
};

function ip(req) {
    return req.headers['x-real-ip'] || req.connection.remoteAddress;
};
module.exports.help = {
    name: "website"
};