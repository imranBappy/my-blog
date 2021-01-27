const { createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    deletePostController,
    postsGetController } = require('../controllers/postController')

const postValidator = require('../validator/post/postValidator')
const { isAuthenticated } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const router = require('express').Router()

router.get('/create', isAuthenticated, createPostGetController)
router.post('/create', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController)

router.get('/edit/:postId', isAuthenticated, editPostGetController)
router.post('/edit/:postId', isAuthenticated, upload.single('post-thumbnail'), postValidator, editPostPostController)

router.get('/delete/:postId', isAuthenticated, deletePostController)

router.get('/', isAuthenticated, postsGetController)


module.exports = router