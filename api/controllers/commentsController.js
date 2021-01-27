const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");


exports.commentsPostController = async (req, res) => {
    const { postId } = req.params
    const { body } = req.body

    if (!req.user) {
        return res.status(403).json({ message: 'Your are not an authenticated user' })
    }


    let comment = new Comment({
        post: postId,
        user: req.user._id,
        body,
        replies: []
    })

    try {
        let createdComment = await comment.save()

        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { 'comments': createdComment._id } }
        )
        let commentJson = await Comment.findById(createdComment._id).populate({
            path: 'user',
            select: 'profilePics username'
        })
        let profile = await Profile.findOne({ user: comment.user })
        let { _id, post, user, body, createdAt, replies } = commentJson
        let newobb = {
            _id,
            name: profile.name,
            post,
            user,
            body,
            createdAt,
            replies
        }

        return res.status(201).json(newobb)

    } catch (error) {

        return res.status(500).json({
            error: 'Server error'
        })
    }
}

exports.repliesCommentPostController = async (req, res, next) => {
    let { commentId } = req.params
    let { body } = req.body

    if (!req.user) {
        return res.status(403).json({ message: 'Your are not an authenticated user' })
    }

    let reply = {
        body,
        user: req.user._id
    }

    try {

        await Comment.findOneAndUpdate(
            { _id: commentId },
            { $push: { 'replies': reply } }
        )
        let profile = await Profile.findOne({ user: req.user._id })


        res.status(201).json({
            ...reply,
            username: req.user.username,
            profilePics: req.user.profilePics,
            name: profile.name
        })

    } catch (error) {

        return res.status(500).json({
            error: 'Server error'
        })
    }
}

