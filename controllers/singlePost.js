//import blog post model
const Post = require('../models/postModel')
//import user model
const User = require('../models/userModel')

module.exports = async (req, res) => {
    try {
        let data = {}
        const post = await Post.findOne({
            title: req.params.title.split('-').join(' ')
        })
        const user = await User.findById(post?.userId)

        data = {
            title : post.title,
            subtitle : post.subtitle,
            content : post.content,
            datePosted : post.datePosted,
            cover : post.cover,
            username : user?.username || '[Deleted Account]'
        }
        
        return res.render('singlePost', { post : data, base : "../" })

    } catch (err) {
        console.error(err)
    }
}