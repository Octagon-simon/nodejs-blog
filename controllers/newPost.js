//import blog post model
const Post = require('../models/postModel')
const path = require('path')

module.exports = (req, res) => {
    //check if session exists
    if (!req.session || !req.session.userId){
        //redirect to
        let next = 'posts/new'
        //check if query exists in the URL
        if(req.query?.title){
            next+=`?title=${req.query.title}`
        }
        //redirect to login page if no session exists
        return res.redirect(`../login?next=${next}`)
    }

    if (req.method == "POST") {

        try {
            //post data
            const postData = Object.assign({}, req.body)

            //get the uploaded image
            const coverImage = req.files.cover

            //check if email address exists already
            Post.findOne({ title: postData.title }, (err, data) => {
                if (err)
                    new Error(err)
                //check if user exists
                if (data === null) {
                    //save fields to model
                    const newPost = new Post(postData)
                    //assign userId field to model
                    newPost['userId'] = req.session.userId;
                    //move uploaded image to specified path
                    coverImage.mv(path.resolve(__dirname, '../uploads/cover_images', coverImage.name), async (err) => {
                        //add cover parameter to the new Post Object
                        newPost['cover'] = coverImage.name
                        //store to db
                        newPost.save().then(savedDoc => {
                            if (savedDoc === newPost) {
                                return res.render('newPost', { success: true, message: "Post has been saved successfully", base: "../" })
                            } else {
                                return res.render('newPost', { success: true, message: "An error occured while saving your post", base: "../" })
                            }
                        })
                    })


                } else {
                    return res.render('newPost',
                        { success: false, message: "A post with this Title exists Already", base: "../" })
                }
            })
        } catch (err) {
            console.log(err)
            res.status(500).send({
                success: false,
                message: "Internal server error"
            })
        }
    } else {
        const data = {
            base : "../"
        }
        if(req.query?.title){
            data.formData = JSON.stringify({ title : req.query.title})
        }
        return res.render('newPost', data)
    }
}