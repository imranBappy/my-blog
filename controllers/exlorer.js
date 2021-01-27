const Post = require("../models/Post")
const Flash = require("../utils/Flash")
const moment = require("moment")
const Profile = require("../models/Profile")

function genDate(days) {
    let date = moment().subtract(days, 'days')
    return date.toDate()
}

function generateFilterObb(filter) {
    let filterObj = {}
    let order = 1
    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt: genDate(7)
                }
            }
            order = 1
            break;
        }
        case 'month': {
            filterObj = {
                createdAt: {
                    $gt: genDate(30)
                }
            }
            order = 1
            break;
        }

        case 'latest': {
            order = 1
            break;
        }
        case 'all': {
            order = -1
            break;
        }
        default:
            break;
    }

    return {
        filterObj,
        order
    }

}


exports.explorerGetController = async (req, res, next) => {

    let filter = req.query.filter || 'latest'

    let currentPage = parseInt(req.query.page) || 1
    let itemPerPage = 10

    let { order, filterObj } = generateFilterObb(filter.toLowerCase())
    try {
        let posts = await Post.find(filterObj)
            .populate('author', 'username')
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip((itemPerPage * currentPage) - itemPerPage)
            .limit(itemPerPage)

        let totalPosts = await Post.countDocuments()
        let totalPage = totalPosts / itemPerPage
        let bookmarks = []

        if (req.user) {
            let profile = await Profile.findOne({ user: req.user._id })
            if (profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer', {
            title: 'Explorer All Post',
            filter,
            posts,
            flashMessages: Flash.getMessage(req),
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks
        })
    } catch (error) {
        next(error)
    }
}

exports.singlePostGetController = async (req, res, next) => {
    let { postId } = req.params

    try {

        let post = await Post.findById(postId)
            .populate('author', 'username profilePics ')
            .populate(
                {
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'username profilePics '
                    }
                }
            )
            .populate(
                {
                    path: 'comments',
                    populate: {
                        path: 'user',
                        populate: {
                            path: 'profile',
                            select: 'name'
                        }
                    }
                }
            )
            .populate(
                {
                    path: 'comments',
                    populate: {
                        path: 'replies.user',
                        select: 'username profilePics, profile'
                    }
                }
            )
            .populate(
                {
                    path: 'comments',
                    populate: {
                        path: 'replies.user',
                        populate: {
                            path: 'profile',
                            select: 'name'
                        }
                    }
                }
            )

        if (!post) {
            let error = new Error('404 post not found')
            error.status = 404
            throw error
        }

        let bookmarks = []

        if (req.user) {
            let profile = await Profile.findOne({ user: req.user._id })
            if (profile) {
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePost', {
            title: post.title,
            flashMessages: Flash.getMessage(req),
            post,
            bookmarks
        })

    } catch (error) {
        next(error)
    }
}