const { validationResult } = require('express-validator')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const Profile = require("../models/Profile")
const User = require('../models/User')
const Flash = require("../utils/Flash")
const validationErrorFormatter = require('../utils/validationErrorFormatter')

exports.dashboardGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id
        }).populate({
            path: 'posts',
            select: 'title thumbnail '
        })
            .populate({
                path: 'bookmarks',
                select: 'title thumbnail'
            })

        if (profile) {
            return res.render('pages/dashboard/dashboard.ejs', {
                title: 'My Dashboard',
                flashMessages: Flash.getMessage(req),
                posts: profile.posts.reverse().slice(0, 2),
                bookmarks: profile.bookmarks.reverse().slice(0, 2),
            })
        } else {

        }
        res.redirect('/dashboard/profile')
    } catch (err) {

        next(err)
    }
}

exports.createProfileGetContoller = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({
            user: req.user._id
        })
        if (profile) {
            return res.redirect('/dashboard/edit-profile')
        }
        res.render('pages/dashboard/create-profile.ejs', {
            title: 'Create Profile',
            flashMessages: Flash.getMessage(req),
            errors: {}
        })
    }

    catch (e) { }
}

exports.createProfilePostContoller = async (req, res, next) => {
    let errors = validationResult(req).formatWith(validationErrorFormatter)

    if (!errors.isEmpty()) {

        return res.render('pages/dashboard/create-profile.ejs', {
            title: 'Create Profile',
            flashMessages: Flash.getMessage(req),
            errors: errors.mapped()
        })
    }
    let { name, title, bio, website, facebook, twitter, github } = req.body

    try {
        let profile = new Profile({
            user: req.user._id,
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            },
            posts: [],
            bookmarks: []
        })
        let createdProfile = await profile.save()

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createdProfile._id } }
        )


        req.flash('success', 'Profile Created successfully')
        res.redirect('/dashboard')
    } catch (e) {
        next(e)
    }
}
exports.editProfileGetContoller = async (req, res, next) => {

    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (!profile) {
            return res.render('/dashboard/profile')
        }
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            errors: {},
            flashMessages: Flash.getMessage(req),
            profile
        })

    } catch (e) {
        next()
    }


}
exports.editProfilePostContoller = async (req, res, next) => {
    let { name, title, bio, website, facebook, twitter, github } = req.body

    let errors = validationResult(req).formatWith(validationErrorFormatter)
    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile.ejs', {
            title: 'Edit Your Profile',
            flashMessages: Flash.getMessage(req),
            errors: errors.mapped(),
            profile: { name, title, bio, links: { website, facebook, twitter, github } }
        })
    }

    try {
        let profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            }
        }
        let updateProfile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: profile },
            { new: true }
        )
        req.flash('success', 'Profile updated successfully')
        res.render('pages/dashboard/edit-profile', {
            title: 'Edit Your Profile',
            errors: {},
            flashMessages: Flash.getMessage(req),
            profile: updateProfile
        })


    } catch (e) {
        next(e)
    }

}


exports.commentsGetController = async (req, res, next) => {
    try {

        let profile = await Profile.findOne({ user: req.user._id })
        let comments = await Comment.find({ post: { $in: profile.posts } })
            .populate({
                path: 'post',
                secret: 'title'
            })
            .populate({
                path: 'user',
                secret: 'username profilePics'
            })
            .populate({
                path: 'replies',
                populate: {
                    path: 'user',
                    populate: {
                        path: 'profile',
                        secret: 'name profilePics'
                    }
                }
            })
        res.render('pages/dashboard/comments', {
            title: 'My Resent Comments',
            flashMessages: Flash.getMessage(req),
            comments
        })

    } catch (error) {
        next(error)
    }
}