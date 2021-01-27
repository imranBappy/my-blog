const Post = require("../models/Post");
const Profile = require("../models/Profile");
const User = require("../models/User");
const Flash = require('../utils/Flash')

exports.profileGetController = async (req, res, next) => {
    let username = req.params.username

    try {
        let user = await User.findOne({ username })
        let profile = await Profile.findOne({ user: user._id })
        let posts = []
        for (let i = 0; i < profile.posts.length; i++) {
            let _id = profile.posts[i];
            let post = await Post.findOne({ _id: _id })
            posts.push(post)
        }
        let profileData = {
            profilePics: user.profilePics,
            name: profile.name,
            title: profile.title,
            bio: profile.bio,
            links: profile.links,
            posts
        }

        res.render('pages/explorer/profile', {
            title: profile.name,
            profile: profileData,
            flashMessages: Flash.getMessage(req)
        })

    } catch (error) {
        next(error)
    }

}

