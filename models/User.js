const { Schema, model } = require('mongoose')
const Profile = require('./Profile')

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        minlength: 10
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: Profile
    },
    profilePics: {
        type: String,
        default: '/uploads/default.jpg'
    }
}, {
    timestamps: true
})
const User = model('User', userSchema)
module.exports = User