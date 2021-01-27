require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const setMiddleware = require('./middleware/middleware');
const setRoutes = require('./routes/routes')
const chalk = require('chalk');

// Database user from mongodb
const url = `mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0.um5ig.mongodb.net/my_blog_info?retryWrites=true&w=majority`;
const app = express();
// setup view Engine
app.set('view engine', 'ejs')
app.set('views', 'views')
// all routes from Middleware direcory
setMiddleware(app)
// all routes from routes direcory
setRoutes(app)

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found');
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('./pages/error/404', { flashMessages: {} })
    }
    console.log(chalk.red(error.message));
    res.render('./pages/error/500', { flashMessages: {} })
})

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
        const PORT = process.env.PORT || 1000;
        app.listen(PORT, (req, res) => {
            console.log(`Server is running on PORT ${PORT}`);
        })
    })
    .catch((err) => console.log(err))