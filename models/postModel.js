const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    content: { type: String, required: true },
    datePosted: {
        type: Date,
        default: new Date()
    },
    cover: { type: String }
})

const Post = mongoose.model('post', PostSchema);

module.exports = Post