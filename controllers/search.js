//import blog post model
const Post = require('../models/postModel')
//get user model
const User = require('../models/userModel')

module.exports = async (req, res) => {
    try {
        const posts = await Post.find({
            title: new RegExp(req.query.title, 'i')
        })
        const output = []

        await Promise.all(posts.map( async item => {
            const user = await User.findOne({
                _id : item.userId
            })

            output.push({
                title : item.title,
                content : item.content,
                datePosted : item.datePosted,
                username : user?.username || '[Deleted Account]'
            })
        }))

        return res.render('index', { posts : output, base : "../", title : req.query.title || ''})

    } catch (err) {
        console.error(err)
    }
}