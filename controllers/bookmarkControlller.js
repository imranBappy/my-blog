const Profile = require("../models/Profile")
const Flash = require("../utils/Flash")

exports.bookmarksGetController = async (req, res, next) => {
    let userId = req.user._id
    try {
        let profile = await Profile.findOne({ user: userId })
            .populate({
                path: 'bookmarks',
                model: 'Posts',
                select: 'title thumbnail _id'
            })

        res.render('pages/explorer/bookmark', {
            title: 'All Bookmarks',
            posts: profile.bookmarks,
            flashMessages: Flash.getMessage(req)
        })

    } catch (error) {
        next(error)
    }



}
