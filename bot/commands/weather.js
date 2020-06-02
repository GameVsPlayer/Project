const Discord = require("discord.js");
const fetch = require('node-fetch');
const moment = require('moment-timezone');
const d2d = require('degrees-to-direction');


module.exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send("No location specified").catch();
    const city2geoAPI = `https://api.opencagedata.com/geocode/v1/json?q=${args.join('%20')}&key=${bot.config.opencagedata}`;
    //bot.logger.info(city2geoAPI);
    const geo = await fetch(city2geoAPI);
    const goeJSON = await geo.json();
    if (goeJSON.status.code != 200) return message.channel.send(`Something went wrong Error: ${goeJSON.status.message}`);
    if (goeJSON.results.length === 0) return message.channel.send("No results found");
    const locationGeo = goeJSON.results[0].geometry;
    let city = goeJSON.results[0].components.city || goeJSON.results[0].components.state || goeJSON.results[0].components.country;
    
    if (city == goeJSON.results[0].components.city) {
        city += `, ${goeJSON.results[0].components.state}, ${goeJSON.results[0].components.country}`;
    } else if (city == goeJSON.results[0].components.state) {
        city += `, ${goeJSON.results[0].components.country}`;
    }


    const weatherAPI = `https://api.darksky.net/forecast/${bot.config.DarkSky}/${locationGeo.lat},${locationGeo.lng}?units=ca&exclude=[minutely,hourly,flags]`;
    let weather = await fetch(weatherAPI);
    weather = await weather.json();
    if (weather.error) return message.channel.send(`Something went wrong ${weather.error}`);
    let times = weather.daily.data[0];
    let currentTime;
    times.sunRise = moment
        .unix(times.sunriseTime)
        .tz(weather.timezone)
        .format('hh:mm:ssa');
    times.sunSet = moment
        .unix(times.sunsetTime)
        .tz(weather.timezone)
        .format('hh:mm:ssa');
    currentTime = moment().tz(weather.timezone).format('hh:mm:ssa');
    weather = weather.currently;
    weather.cloudCover = (weather.cloudCover * 100).toFixed(0);
    weather.humidity = (weather.humidity * 100).toFixed(0);


    let botembed = new Discord.RichEmbed()
        .setTitle(`**Weather Information for ${city}**`)
        .setColor(bot.config.color)
        .addField("Current Temperature", `${weather.temperature}°C(${(weather.temperature * 9 / 5 + 32).toFixed(2)}°F) feels like ${weather.apparentTemperature}°C(${(weather.apparentTemperature * 9 / 5 + 32).toFixed(2)}°F)`, true)
        .addField("Cloud Coverage", `${weather.cloudCover}%`, true)
        .addField("Current Humidity", `${weather.humidity}%`, true)
        .addField("Wind", `The Wind is blowing at ${weather.windSpeed}kmh with a direction of ${d2d(weather.windBearing)} or ${weather.windBearing}°`, true)
        .addField("Sunrise/set + moon phase", `${times.sunRise}/${times.sunSet} ${times.moonPhase * 100}%`, true)
        .addField("Summary", weather.summary, true)
        .addField("Localtime", `${currentTime}`, true)
        .setFooter(`The Geolocation of ${city} is ${locationGeo.lat}, ${locationGeo.lng}`, "https://img.icons8.com/nolan/128/000000/map.png")
        .setThumbnail(`https://darksky.net/images/weather-icons/${weather.icon}.png`);



    return message.channel.send(botembed).catch();

}
module.exports.help = {
    name: "weather"
}