
let dbData: any = [];
let todos: any = {};

export default function (bot: any) {
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
            if (item === null || err) return;
            dbData.push(item);
            todos.data = dbData;
        })
    }, 60000);
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
        bot.redis.set('botdata', JSON.stringify(pushData), () => {
            return;
        });
    }, 1000);
}
