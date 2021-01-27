const { isAuthenticated } = require('../../middleware/authMiddleware')
const { bookmarksGetController } = require('../controllers/bookmarksController')
const { commentsPostController, repliesCommentPostController } = require('../controllers/commentsController')
const { likesGetController, dislikesGetController } = require('../controllers/likeDislikeController')
const router = require('express').Router()


router.post('/comments/:postId', isAuthenticated, commentsPostController)
router.post('/comments/replies/:commentId', isAuthenticated, repliesCommentPostController)

// like dislike
router.get('/likes/:postId', isAuthenticated, likesGetController)
router.get('/dislikes/:postId', isAuthenticated, dislikesGetController)

// bookmarksGetController
router.get('/bookmarks/:postId', isAuthenticated, bookmarksGetController)


module.exports = router