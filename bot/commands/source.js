const Discord = require("discord.js");
const fetch = require('node-fetch');
const parseUrl = require("parse-url");
const shortUrl = require('tinyurl');

module.exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission("EMBED_LINKS")) return message.channel.send("I dont have the permission to send embeds").catch((error) => {
        return error
    });
    try {
        message.delete().catch((error) => {
            return error
        });
    } catch (e) {}
    if (!args[0]) return message.channel.send("No Sourcelink specified").catch();

    /**
     * Add two numbers.
     * @param {string} str The url to check.
     * @return {boolean} returns true if the url is valid.
     */
    function validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(str);
    }
    if (!validURL(args.join('%20'))) return message.channel.send('That is not a valid url');
    const sourceAPI = `https://saucenao.com/search.php?db=999&output_type=2&numres=3&url=${args.join('%20')}&key=${bot.config.saucenaoAPI}`;
    //console.log(sourceAPI);
    let source = await fetch(sourceAPI);
    source = await source.json();
    if (source.results == undefined || source.results[0].header.similarity < 90) return message.channel.send('No results found!');
    const results = source.results;
    let source1URL, source2URL, source3URL, reqURL, source1, source2, source3;



    if (results[0].data.ext_urls != undefined) {
        source1 = parseUrl(results[0].data.ext_urls[0]).resource;
        shortUrl.shorten(args.join('%20'), function (shortReq, err) {
            reqURL = shortReq
        });
        shortUrl.shorten(results[0].data.ext_urls[0], function (short1URL, err) {
            source1URL = short1URL
        });
    } else if (results[0].data.source) {
        source1 = '';
        source1URL = `${results[0].data.source} by ${results[0].data.creator[0]}`;
    }



    if (results[1] != undefined && results[1].data.ext_urls != undefined) {
        source2 = parseUrl(results[1].data.ext_urls[0]).resource;
        shortUrl.shorten(results[1].data.ext_urls[0], function (short2URL, err) {
            source2URL = short2URL
        });
    } else if (results[1].data.source) {
        source2 = '';
        source2URL = `${results[1].data.source} by ${results[1].data.creator[0]}`;
    }
    if (results[2] != undefined && results[2].data.ext_urls != undefined) {
        source3 = parseUrl(results[2].data.ext_urls[0]).resource;
        shortUrl.shorten(results[2].data.ext_urls[0], function (short3URL, err) {
            source3URL = short3URL
        });
    } else if (results[2].data.source) {
        source3 = '';
        source3URL = `${results[2].data.source} by ${results[2].data.creator[0]}`;
    }





    /**
     * sleeping
     * @param {number} time sleep timer.
     * @return {Promise} delay promise.
     */

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    // Usage!
    await sleep(1000);

    if (reqURL == undefined) reqURL = args.join('%20');

    let botembed = new Discord.RichEmbed()
        .setTitle(`**Source**`)
        .setColor(bot.config.color)
        .addField("Requested link", reqURL, true)
        .addField(`Source 1 (${source1})`, `Simularity: ${results[0].header.similarity}% Link/Name: ${source1URL}`, true)
        .addField(results[1] === undefined || results[1].header.similarity < 90 ? '\u200b' : `Source 2 (${source2})`, results[1] === undefined || results[1].header.similarity < 90 ? '\u200b' : `Simularity: ${results[1].header.similarity}% Link/Name: ${source2URL}`, true)
        .addField(results[2] === undefined || results[2].header.similarity < 90 ? '\u200b' : `Source 3 (${source3})`, results[2] === undefined || results[2].header.similarity < 90 ? '\u200b' : `Simularity: ${results[2].header.similarity}% Link/Name: ${source3URL}`, true)
        .setThumbnail(args.join('%20'));

    return message.channel.send(botembed).catch();


}
module.exports.help = {
    name: "source"
}