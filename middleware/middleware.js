const morgan = require("morgan");
const express = require('express');
const session = require('express-session');
const { bindUserWithRequest } = require('./authMiddleware.js');
const setLocals = require('./setLocals.js');
const flash = require('connect-flash');
const config = require('config');
const MongoDBStore = require('connect-mongodb-session')(session);

const url = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0.um5ig.mongodb.net/my_blog_info?retryWrites=true&w=majority`;

var store = new MongoDBStore({
    uri: url,
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2000000
});

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: config.get('secret-key'),
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    bindUserWithRequest(),
    setLocals(),
    flash()
]

module.exports = app => {
    middleware.forEach(m => {
        app.use(m)
    })
}