const User = require('../models/User');
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

exports.signupGetController = async (req, res, next) => {

    res.render('pages/auth/signup', {
        title: 'Create you account',
        errors: {},
        value: {},
        flashMessages: Flash.getMessage(req)
    })
}

exports.signupPostController = async (req, res, next) => {
    const { username, email, password } = req.body

    let errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please check you form')
        return res.render('pages/auth/signup', {
            title: 'Create you account',
            errors: errors.mapped(),
            value: { username, email, password },
            flashMessages: Flash.getMessage(req)
        })
    }

    try {
        let hashedPass = await bcrypt.hash(password, 11)
        const user = new User({ username, email, password: hashedPass })
        await user.save()
        req.flash('success', 'User created successfully')
        res.redirect('/auth/login')
    } catch (e) {
        next(e)
    }
}
exports.loginGetController = (req, res, next) => {

    res.render('pages/auth/login', {
        title: 'Login to you accout',
        errors: {},
        flashMessages: Flash.getMessage(req)
    })

}
// 
exports.loginPostController = async (req, res, next) => {
    const { email, password } = req.body
    let errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please your form')

        return res.render('pages/auth/login', {
            title: 'Login to you accout',
            errors: errors.mapped(),
            flashMessages: Flash.getMessage(req)
        })
    }
    try {
        let user = await User.findOne({ email })
        if (!user) {
            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login to you accout',
                errors: {},
                flashMessages: Flash.getMessage(req)
            })
        }
        let match = await bcrypt.compare(password, user.password)
        if (!match) {
            req.flash('fail', 'Please provide valid credentials')
            return res.render('pages/auth/login', {
                title: 'Login to you accout',
                errors: {},
                flashMessages: Flash.getMessage(req)
            })
        }
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            if (err) {

                return next(err)
            }
            req.flash('success', 'Successfully Logged In')

            res.redirect('/dashboard')
        })

    } catch (err) {
        next(err)
    }
}

exports.logoutController = (req, res, next) => {
    req.flash('success', 'Successfully Logout')

    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        return res.redirect('/auth/login');
    })
}


exports.changePasswordGetController = async (req, res, next) => {

    res.render('pages/auth/changePassword', {
        title: 'Change Password',
        flashMessages: Flash.getMessage(req)
    })

}


exports.changePasswordPostController = async (req, res, next) => {

    let { oldPassword, newPassword, confirmPassword } = req.body
    if (newPassword !== confirmPassword) {
        req.flash('fail', 'Password Dose Not Match')
        return res.redirect('/auth/change-password')
    }
    try {

        let match = await bcrypt.compare(oldPassword, req.user.password)
        if (!match) {
            req.flash('fail', 'Invalid Old Password')
            return res.redirect('/auth/change-password')
        }

        let hash = await bcrypt.hash(newPassword, 11)

        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { password: hash } }
        )
        req.flash('success', 'Password updated successfully')
        res.redirect('/auth/change-password')
    } catch (error) {
        next(error)
    }

}