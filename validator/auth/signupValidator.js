const User = require('../../models/User')
const { body } = require('express-validator')

module.exports = [
    body('username')
        .isLength({ min: 5, max: 30 }).withMessage('Username Must Be Between 5 to 30 Characters')
        .custom(async username => {
            const user = await User.findOne({ username })
            if (user) {
                return Promise.reject('Username name already used')
            }
        })
        .trim(),

    body('email')
        .isEmail().withMessage('Please Provide Your Valid Email')
        .custom(async email => {
            const user = await User.findOne({ email })
            if (user) {
                return Promise.reject('Email name already used')
            }
        })
        .normalizeEmail(),

    body('password')
        .isLength({ min: 5 })
        .withMessage('Your Password Must Be Grater Than 5 Characters')
    ,
    body('confirmPassword')
        .isLength({ min: 5 }).withMessage('Your Password Must Be Grater Than 5 Characters')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Password Dose not Match')
            }
            return true
        })
]