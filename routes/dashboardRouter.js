const {
    dashboardGetController,
    createProfileGetContoller,
    createProfilePostContoller,
    editProfileGetContoller,
    editProfilePostContoller,
    commentsGetController
} = require('../controllers/dashboardController')
const profileValidetor = require('../validator/dashboard/profileValidetor')
const { isAuthenticated } = require('../middleware/authMiddleware')

const router = require('express').Router()
router.get('/', isAuthenticated, dashboardGetController)

router.get('/profile', isAuthenticated, createProfileGetContoller)
router.post('/profile', isAuthenticated, profileValidetor, createProfilePostContoller)

router.get('/edit-profile', isAuthenticated, editProfileGetContoller)
router.post('/edit-profile', isAuthenticated, profileValidetor, editProfilePostContoller)

router.get('/comments', isAuthenticated, commentsGetController)

module.exports = router