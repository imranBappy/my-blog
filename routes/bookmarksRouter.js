const { bookmarksGetController } = require('../controllers/bookmarkControlller')

const router = require('express').Router()

router.get('/', bookmarksGetController)

module.exports = router

