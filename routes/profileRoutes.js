const { profileGetController } = require('../controllers/profileController')

const router = require('express').Router()

router.get('/:username', profileGetController)

module.exports = router