//import blog post model
const Post = require('../models/postModel')

module.exports = async (req, res) => {
    try {
        const posts = await Post.find({
            title: new RegExp(req.query.title, 'i')
        })

        return res.render('index', { posts, base : "../"})

    } catch (err) {
        console.error(err)
    }
}