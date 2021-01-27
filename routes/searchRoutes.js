const { searchResultGetController } = require('../controllers/searchController')

const router = require('express').Router()



router.get('/', searchResultGetController)

module.exports = router