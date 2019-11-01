const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const redis = require('redis');
const axios = require('axios');
require('dotenv').config();

const subscriber = redis.createClient(), producer = redis.createClient();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const localClient = (config) => axios({
    baseURL: process.env.LOCAL_URL,
    timeout: 13000,
    ...config
});
const parse_message = (data, channel) => {
    const parsed_message  = JSON.parse(data);
    parsed_message.data.status = channel;
    console.log(parsed_message);
    return parsed_message;
}

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


subscriber.on("message",  async (channel, message) => {
    console.log("sub channel " + channel + ": " + message);
    const parsed_message  = parse_message(message, channel);
    const data = await localClient({
        url: `/${channel}`,
        data: parsed_message.data,
        method: parsed_message.method
    });
    console.log(data.data);
});

subscriber.on("pmessage", async (pattern, channel, message) => {
    console.log("pattern " + pattern + " sub channel " + channel + ": " + message);
    const parsed_message  = parse_message(message);
    const data = await localClient({
        url: `/${channel}`,
        data: parsed_message.data,
        method: parsed_message.method
    });
    console.log(data.data);
});

subscriber.subscribe("MOVED_FOLDER");
subscriber.subscribe("CREATED_FOLDER");
subscriber.psubscribe('user.*');
subscriber.psubscribe('folder.*');

app.use('/', indexRouter);

module.exports = app;
