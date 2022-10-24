//import blog post model
const Post = require('../models/postModel')
//import user model
const User = require('../models/userModel')

module.exports = async (req, res) => {
    try {
        
        console.log(req.headers.referer)
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
            cover : `/uploads/cover_images/${post.cover}`,
            username : user?.username || '[Deleted Account]'
        }
        
        //check if a message for this page is stored in the session
        return res.render('singlePost', { post : data, base : "../" })

    } catch (err) {
        console.error(err)
    }
}