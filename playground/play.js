const upload = require('../middleware/uploadMiddleware')
const router = require('express').Router()

router.get('/play', (req, res, next) => {
    res.render('playground/play', { title: 'Playground', flashMessages: {} })
})

router.post('/play', upload.single('my-file'), (req, res, next) => {
    if (req.file) {
        console.log(req.file);
    }
    res.redirect('/playground/play')
})

module.exports = router;