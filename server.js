require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express();
const port = 3000;
const routes = require('./routes.js');
const sslOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};
const IP_ADDRESS = '127.0.0.1';
app.use('/', routes);
app.use(express.static('views'));


https.createServer(sslOptions, app).listen(port, IP_ADDRESS, function () {
    console.log('--- Secure Server Status ---');
    console.log(`Server is successfully running on HTTPS`);
    console.log(`Listening at: https://${IP_ADDRESS}:${port}`);
    console.log('----------------------------');
});

