import express, { Request, Response } from 'express';
const app = express();
import compression from 'compression';
import fetch from 'node-fetch';
import helmet from 'helmet';
import bodyParser from 'body-parser';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

import path from 'path';
require('dotenv').config({
    path: path.join(__dirname, '/.env')
});


const info = process.env;

app.use(compression());
app.use(helmet());
app.disable('x-powered-by');
let currentData: any = '';

async function fetchData() {
    let response = await fetch('http://127.0.0.1:10025/api/').catch((err: Error) => {
        err = null
    });
    if (!response) return;
    response = await response.json();
    currentData = response;
};

setInterval(() => {
    fetchData();
}, 1000);

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


app.get('/statsUpdate/', (req: Request, res: Response) => {
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

app.get('/serverUpdate/', async (req: Request, res: Response) => {
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

app.get('/todo/', async (req: Request, res: Response) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write("data: " + JSON.stringify(currentData.todo) + "\n\n");
    res.flush();
});

app.post('/verify/', async (req: Request, res: Response) => {
    const token = req.body.token;
    let response: any = await fetch('https://www.google.com/recaptcha/api/siteverify?secret=' + info.secretKey + "&response=" + token + "&remoteip=" + req.connection.remoteAddress)
    response = await response.json();
    if (response.score >= 0.7) {
        res.json({
            status: 'accepted!',
            message: [info.info]
        });
    } else {
        res.json({
            status: 'denied!',
            message: ["Error: You identify as a bot"]
        });
    }
    return res.end();
});

app.get('/serverStats/', (req: Request, res: Response) => {
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

app.listen(process.env.backendPort || 10026, function () {

    console.log(`Backend running on port ${process.env.backendPort || 1026}`);
});