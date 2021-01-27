const { Schema, model } = require('mongoose').set('debug', true)


const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    body: {
        type: String,
        trim: true,
        required: true
    },
    replies: [
        {
            body: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            date: {
                type: Date,
                default: new Date()
            }
        }
    ]
}, { timestamps: true })

const Comment = model('comments', commentSchema)
module.exports = Comment