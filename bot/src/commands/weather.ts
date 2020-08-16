import { Message, MessageEmbed } from "discord.js";
const geoTz = require('geo-tz')
import Discord from "discord.js";
import fetch from 'node-fetch';
import moment from 'moment-timezone';

const d2d = require('degrees-to-direction');


module.exports.run = async (bot: any, message: Message, args: string[]) => {
    if (!args[0]) return message.channel.send("No location specified").catch();
    const city2geoAPI = `https://api.opencagedata.com/geocode/v1/json?q=${args.join('%20')}&key=${bot.config.opencagedata}`;
    //bot.logger.info(city2geoAPI);
    const geo = await fetch(city2geoAPI);
    const goeJSON: any = await geo.json();
    if (goeJSON.status.code != 200) return message.channel.send(`Something went wrong Error: ${goeJSON.status.message}`);
    if (goeJSON.results.length === 0) return message.channel.send("No results found");
    const locationGeo = goeJSON.results[0].geometry;
    let city = goeJSON.results[0].components.city || goeJSON.results[0].components.state || goeJSON.results[0].components.country;

    if (city == goeJSON.results[0].components.city) {
        city += `, ${goeJSON.results[0].components.state}, ${goeJSON.results[0].components.country}`;
    } else if (city == goeJSON.results[0].components.state) {
        city += `, ${goeJSON.results[0].components.country}`;
    }
    let onehour: any = new Date(Date.now() + (1000 * 60 * 60))

    onehour = onehour.toISOString()
    let newAPI = `https://api.climacell.co/v3/weather/forecast/hourly?lat=${locationGeo.lat}&lon=${locationGeo.lng}&unit_system=si&fields=precipitation,temp,feels_like,dewpoint,humidity,wind_speed,wind_direction,wind_gust,baro_pressure,precipitation,precipitation_type,precipitation_probability,sunrise,sunset,cloud_cover,moon_phase&start_time=now&end_time=${onehour}&apikey=${bot.config.climacell}`


    let weather: any = await fetch(newAPI, { headers: { 'Content-Type': 'application/json' } });
    weather = await weather.json();

    // let weather: any = await fetch(weatherAPI);

    weather = weather[weather.length - 1];
    if (weather.error) return message.channel.send(`Something went wrong ${weather.error}`);

    let timezone = await geoTz(locationGeo.lat, locationGeo.lng)
    timezone = timezone[0];

    weather.sunRise = moment
        .utc(weather.sunrise.value)
        .tz(timezone)
        .format('hh:mm:ssa');
    weather.sunSet = moment
        .utc(weather.sunset.value)
        .tz(timezone)
        .format('hh:mm:ssa');
    let currentTime = moment().tz(timezone).format('hh:mm:ssa');


    let botembed: MessageEmbed = new Discord.MessageEmbed()
        .setTitle(`**Weather Information for ${city}**`)
        .setColor(bot.config.color)
        .addField("Current Temperature", `${weather.temp.value}°C(${(weather.temp.value * 9 / 5 + 32).toFixed(2)}°F) feels like ${weather.feels_like.value}°C(${(weather.feels_like.value * 9 / 5 + 32).toFixed(2)}°F)`, true)
        .addField("Cloud Coverage", `${weather.cloud_cover.value}%`, true)
        .addField("Current Humidity", `${weather.humidity.value}%`, true)
        .addField("Wind", `The Wind is blowing at ${weather.wind_speed.value}kmh with a direction of ${d2d(weather.wind_direction.value)} or ${weather.wind_direction.value}°`, true)
        .addField("Sunrise/set + moon phase", `${weather.sunRise}/${weather.sunSet} ${weather.moon_phase.value}`, true)
        .addField("Localtime", `${currentTime}`, true)
        .setFooter(`The Geolocation of ${city} is ${locationGeo.lat}, ${locationGeo.lng}`, "https://img.icons8.com/nolan/128/000000/map.png")



    return message.channel.send(botembed).catch();

}
module.exports.help = {
    name: "weather"
}


let weatherAPI =
{
    lat: 51.6512192,
    lon: 7.3393014,
    temp: { value: 24.61, units: 'C' },
    precipitation: { value: 0.0293, units: 'mm/hr' },
    precipitation_type: { value: 'rain' },
    precipitation_probability: { value: 15, units: '%' },
    feels_like: { value: 24.61, units: 'C' },
    humidity: { value: 69.71, units: '%' },
    baro_pressure: { value: 1014.13, units: 'hPa' },
    dewpoint: { value: 18.79, units: 'C' },
    wind_speed: { value: 1.81, units: 'm/s' },
    wind_gust: { value: 3.85, units: 'm/s' },
    wind_direction: { value: 127.42, units: 'degrees' },
    cloud_cover: { value: 100, units: '%' },
    sunrise: { value: '2020-08-15T04:16:39.424Z' },
    sunset: { value: '2020-08-15T18:53:14.213Z' },
    moon_phase: { value: 'waning_crescent' },
    observation_time: { value: '2020-08-15T18:00:00.000Z' }
}