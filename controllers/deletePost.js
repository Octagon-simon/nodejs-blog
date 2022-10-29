const path = require('path')
const fs = require('fs')
const Post = require('../models/postModel')
module.exports = async (req, res) => {
    try{
        //chech if user id logged in
        if (!req.session?.userId) return res.redirect('../login?next=posts')
        //check if id does not exist in query, then redirect
        if(!req.query?.id) return res.redirect('../posts')
        //find and delete post document
        const deletedPost = await Post.findOneAndDelete({
            _id : req.query.id,
            userId : req.session.userId
        })
        //check if post document was returned
        if(deletedPost){
            //remove post image if it exists
            if(deletedPost.cover){
                fs.unlink(path.resolve(__dirname, './uploads/cover_images', deletedPost.cover), (err) => {
                    if(err)
                        throw new Error(err)
                    console.log('Cover photo of post has been deleted')
                })
            }
            req.session.postsPage = {
                success : true,
                message : "Post was deleted successfully"
            }
            return res.status(200).redirect('../posts')
        }else{
            req.session.postsPage = {
                success : false,
                message : "Sorry, couldn't delete post"
            }
            return res.status(401).redirect('../posts')
        }
    }catch(err){
        console.log(err)
        req.session.postsPage = {
            success : false,
            message : "A Server Error has occured"
        }
        return res.status(500).redirect('../posts')
    }
}