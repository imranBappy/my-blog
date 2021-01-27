const Flash = require('../utils/Flash')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter')
const readingTime = require('reading-time');
const Post = require('../models/Post');
const Profile = require('../models/Profile');



exports.createPostGetController = (req, res, next) => {
    res.render('pages/dashboard/post/createPost',
        {
            title: 'Create A New Post',
            errors: {},
            flashMessages: Flash.getMessage(req),
            value: {}
        }
    )
}

exports.createPostPostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter)
    let { title, body, tags } = req.body
    if (!errors.isEmpty()) {
        res.render('pages/dashboard/post/createPost',
            {
                title: 'Create A New Post',
                errors: errors.mapped(),
                value: { title, body, tags },
                flashMessages: Flash.getMessage(req)
            })
    }

    if (tags) {
        tags = tags.split(',')
        tags = tags.map(t => t.trim())
    }
    let readTime = readingTime(body).text

    let post = new Post({
        title,
        body,
        tags,
        author: req.user._id,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })

    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        let createdPosts = await post.save()

        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $push: { 'posts': createdPosts._id } }
        )
        req.flash('success', 'Post Created successfully')
        res.redirect(`/posts/edit/${createdPosts._id}`)
    } catch (e) {
        next(e)
    }
}


exports.editPostGetController = async (req, res, next) => {
    let postId = req.params.postId
    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if (!post) {
            let error = new Error('404 Page not found')
            error.status = 404
            throw new error
        }
        res.render('pages/dashboard/post/editPost',
            {
                title: 'Edit Post',
                errors: {},
                flashMessages: Flash.getMessage(req),
                post
            }
        )


    } catch (error) {
        next(error)
    }
}

exports.editPostPostController = async (req, res, next) => {
    let { title, body, tags } = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormatter)
    let readTime = readingTime(body).text
    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if (!post) {
            let error = new Error('404 Page not found')
            error.status = 404
            throw new error
        }
        if (!errors.isEmpty()) {
            return res.render('pages/dashboard/post/createPost',
                {
                    title: 'Create A New Post',
                    errors: errors.mapped(),
                    post,
                    flashMessages: Flash.getMessage(req)
                })
        }

        if (tags) {
            tags = tags.split(',')
            tags = tags.map(t => t.trim())
        }
        let thumbnail = post.thumbnail
        if (req.file) {
            thumbnail = '/uploads/' + req.file.filename
        }

        await Post.findOneAndUpdate(
            { _id: post._id },
            { $set: { title, body, tags, thumbnail, readTime } },
            { new: true }
        )
        req.flash('success', 'Post updated successfully')
        res.redirect('/posts/edit/' + post._id)
    } catch (error) {
        next(error)
    }
}

exports.deletePostController = async (req, res, next) => {
    let { postId } = req.params
    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId })
        if (!post) {
            let error = new Error('404 post not found')
            error.status = 404
            throw error
        }
        await Post.findOneAndDelete({ _id: postId })
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { 'posts': postId } }
        )
        req.flash('success', 'Post delete successfully')
        res.redirect('/posts')

    } catch (error) {

    }
}

exports.postsGetController = async (req, res, next) => {
    try {
        let posts = await Post.find({ author: req.user._id })
        res.render('pages/dashboard/post/posts', {
            title: 'Your Created Posts',
            posts,
            flashMessages: Flash.getMessage(req)

        })
    } catch (error) {
        next(error)
    }
}