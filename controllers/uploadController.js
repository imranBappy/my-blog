const Profile = require("../models/Profile");
const User = require("../models/User");
const fs = require('fs')

exports.uploadProfilePics = async (req, res) => {
    if (req.file) {
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            let profilePics = `/uploads/${req.file.filename}`
            let oldProfilePic = req.user.profilePics

            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics } }
                )
            }
            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics } }

            )

            if (oldProfilePic !== '/uploads/default.jpg') {
                fs.unlinkSync(`public${oldProfilePic}`)
            }

            res.redirect('/dashboard/profile')

        } catch (err) {
            res.redirect('/dashboard/profile')
        }
    } else {
        res.redirect('/dashboard/profile')
    }
}

exports.removeProfilePics = async (req, res, next) => {
    try {
        let defaultProfile = '/uploads/default.jpg'
        let currentProfile = req.user.profilePics
        let profile = await Profile.findOne({ user: req.user._id })

        if (profile) {
            await Profile.findOneAndUpdate(
                { user: req.user._id },
                { $set: { profilePics: defaultProfile } }
            )
        }
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profilePics: defaultProfile } }
        )


        if (currentProfile !== '/uploads/default.jpg') {
            fs.unlinkSync(`public${currentProfile}`)
        }
        res.redirect('/dashboard/profile')

    } catch (err) {
        res.redirect('/dashboard/profile')
    }
}

exports.postImageUploadController = (req, res, next) => {
    if (req.file) {
        return res.status(200).json({
            imgUrl: `/uploads/${req.file.filename}`
        })
    }
    res.redirect('/dashboard/profile')
}