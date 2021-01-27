
const authRouter = require('./authRouter')
const postRouter = require('./postRoute.js')
const dashboardRouter = require('./dashboardRouter')
const playgroundRoutes = require('../playground/play')
const uploadRoutes = require('./uploadRoutes')
const apiRoutes = require('../api/routes/apiRoutes')
const explorerRoutes = require('./explorerRoutes')
const searchRoutes = require('./searchRoutes')
const profileRoutes = require('./profileRoutes')
const bookmarksRouter = require('./bookmarksRouter')


const routes = [
    {
        path: '/auth',
        controller: authRouter
    },
    {
        path: '/dashboard',
        controller: dashboardRouter
    },
    {
        path: '/uploads',
        controller: uploadRoutes
    },
    {
        path: '/posts',
        controller: postRouter
    },
    {
        path: '/explorer',
        controller: explorerRoutes
    },
    {
        path: '/user',
        controller: profileRoutes
    },
    {
        path: '/bookmarks',
        controller: bookmarksRouter
    },
    {
        path: '/search',
        controller: searchRoutes
    },
    {
        path: '/api',
        controller: apiRoutes
    },
    {
        path: '/',
        controller: (req, res) => res.redirect('/explorer')
    },
    {
        path: '/playground',
        controller: playgroundRoutes
    }
]

module.exports = app => {
    routes.forEach(route => {
        const { path, controller } = route;
        if (path === '/') {
            app.get(path, controller)
        } else {
            app.use(path, controller)
        }
    })
}