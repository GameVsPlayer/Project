const express = require('express');
const app = express();
const compression = require('compression');
const fetch = require('node-fetch');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const info = require('info.json');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '/.env')
});


const info = process.env;

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
let currentData = '';

async function fetchData() {
    let response = await fetch('http://127.0.0.1:1025/api/').catch(err => {
        err = null
    });
    if (!response) return;
    response = await response.json();
    currentData = response;
};

setInterval(() => {
    fetchData();
}, 1000);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


app.get('/statsUpdate/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let int = setInterval(() => {
        res.write("data: " + JSON.stringify(currentData.stats) + "\n\n");
        res.flush();
    }, 1000);

    res.on('close', function () {
        clearInterval(int);
    })

});

app.get('/serverUpdate/', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    await sleep(6000);
    res.write('retry: 60000\n');
    res.write("data: " + JSON.stringify(currentData.server) + "\n\n");
    res.flush();
    let ser = setInterval(() => {
        res.write('retry: 60000\n');
        res.write("data: " + JSON.stringify(currentData.server) + "\n\n");
        res.flush();
    }, 60000);

    res.on('close', function () {
        clearInterval(ser);
    })

});

app.get('/todo/', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write("data: " + JSON.stringify(currentData.todo) + "\n\n");
    res.flush();
});

app.post('/verify/', async (req, res) => {
    const token = req.body.token;
    let response = await fetch('https://www.google.com/recaptcha/api/siteverify?secret=' + info.secretKey + "&response=" + token + "&remoteip=" + req.connection.remoteAddress)
    response = await response.json();
    if (response.score >= 0.5) {
        res.json({
            status: 'accepted!',
            message: info.info;
        });
    } else {
        res.json({
            status: 'denied!',
            message: ["Error: You identify as a bot"]
        });
    }
    return res.end();
});

app.get('/serverStats/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    let server = setInterval(() => {
        res.write("data: " + JSON.stringify(currentData.server) + "\n\n");
        res.flush();
    }, 1000);

    res.on('close', function () {
        clearInterval(server);
    })

});


let listener = app.listen(process.env.backendPort || 1026, function () {
    console.log('Backend running on port ' + listener.address().port);
});