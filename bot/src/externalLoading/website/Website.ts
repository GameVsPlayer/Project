import express, { Request, Response } from 'express';
const app = express();
const httpServer = require('http').createServer(app);;
import helmet from 'helmet';
let dbData: any = [];
let todos: any = {};

module.exports.run = async (bot: any) => {
    let find = bot.db.todoDB.find();
    setTimeout(async () => {
        find.each(function (err: Error, item: any) {
            if (err) return bot.logger.error(err);
            if (item === null) return;
            dbData.push(item);
            todos.data = dbData;
        })
    }, 1000)
    setInterval(async () => {
        dbData = [];
        find.each(function (err: Error, item: any) {
            if (item === null) return;
            dbData.push(item);
            todos.data = dbData;
        })
    }, 60000);
    app.use(helmet());
    let pushData: any;
    setInterval(() => {
        pushData = {
            stats: {
                users: bot.users.cache.size,
                servers: bot.guilds.cache.size,
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

    app.get('/api/', (req: Request, res: Response) => {
        if (ip(req) === '127.0.0.1' || ip(req) === '::1' || ip(req) === '::ffff:127.0.0.1') {
            res.json(pushData || {
                error: 'no Data available'
            });
        } else return;
    });

    httpServer.listen(process.env.BotPORT || 1025);
};

function ip(req: Request) {
    return req.headers['x-real-ip'] || req.connection.remoteAddress;
};
module.exports.help = {
    name: "website"
};