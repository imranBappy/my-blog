const { explorerGetController, singlePostGetController } = require('../controllers/exlorer')

const router = require('express').Router()

router.get('/:postId', singlePostGetController)

router.get('/', explorerGetController)

module.exports = router