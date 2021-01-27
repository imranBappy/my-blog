const { Schema, model } = require('mongoose')
const User = require('./User')
const Comment = require('./Comment')

const postSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 100,
    },
    body: {
        type: String,
        maxlength: 5000,
        required: true,
    },
    tags: {
        type: [String],
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thumbnail: String,
    readTime: String,
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: Comment
        }
    ]

}, { timestamps: true })

postSchema.index({
    title: 'text',
    tags: 'text',
    body: 'text',
    author: 'text'
}, {
    weights: {
        title: 5,
        tags: 5,
        body: 3
    }
})



const Post = model('Posts', postSchema)

module.exports = Post
