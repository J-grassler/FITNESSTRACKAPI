require('dotenv').config();
const express = require('express');
const server = express();

const client = require('./db/client');

const cors = require('cors');
server.use(cors());

const morgan = require('morgan');
server.use(morgan('dev'));

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const { PORT=3000 } = process.env;

server.use('/api', require('./api'));

server.use((err, req, res, next) => {
    res.send(err);
});

server.listen(PORT, () => {
    client.connect();
    console.log('The Client is connected and The Server is now up and listening on Port: ', PORT);
})