const express = require('express')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
//import blog post model
const Post = require('./models/postModel')
//import user model
const User = require('./models/userModel')
const multer = require('multer')
const fileUpload = require('express-fileupload')
const database = require('./utils/database')

const app = express()
global.port = process.env.PORT || 5000

//parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: true }))
//parse json bodies (as sent by api clients)
app.use(express.json())
//load static files
app.use('/assets', express.static('./assets'));
//load static files
app.use('/uploads', express.static('./uploads'));
//register the package in express
app.use(fileUpload())

//register session in express
app.use(session({
    secret: 'First Nodejs Project',
    resave: true,
    saveUninitialized: true
}))
//set userid if user is logged in or not
global.loggedIn = false;
//automatically redirect to a page when redirection is needed
global.redirect = '';
//send loggedIn var to all pages
app.use("*", (req, res, next) => {
    if (req.session && req.session.userId)
        loggedIn = true;
    if (req.query?.next)
        redirect = req.query?.next
    next();
})

//set template engine
app.set('view engine', 'ejs')
//set the default views folder
app.set('views', './pages')

//parse multipart/form data
//app.use(multer().array())

//update all records
/*
Post.updateMany({
    userId : "632b28550e31b1ceff602680"
})
.then(da => {
    console.log(da)
})
.catch(er => {
    console.log(er)
})
*/

//load home page
app.get('/', async (req, res) => {
    //res.sendFile(path.resolve(__dirname + '/pages/index.html'))
    const posts = await Post.find({})
    let output = []
    await Promise.all(posts.map(async (item) => {
        const user = await User.findOne({ _id: item.userId })
        output.push({
            title: item.title,
            subtitle: item.subtitle,
            content: item.content,
            datePosted: item.datePosted,
            username: user?.username || '[Deleted Account]',
            cover: item.cover
        })
    }))
    let loggedInData = undefined

    if (req.session && req.session.loggedInData) {
        loggedInData = JSON.parse(req.session.loggedInData)
        delete req.session.loggedInData
    }

    return res.render('index', { posts: output, loggedInData })
})
//load about page
app.get('/about', (req, res) => {
    //res.sendFile(path.resolve(__dirname + '/pages/about.html'))
    res.render('about')
})
//load contact page
app.get('/contact', (req, res) => {
    //res.sendFile(path.resolve(__dirname + '/pages/contact.html'))
    res.render('contact')
})
//load sample post page
app.get('/sample-post', (req, res) => {
    //res.sendFile(path.resolve(__dirname + '/pages/post.html'))
    res.render('samplePost')
})
//load registration page
app.use('/register', require('./middlewares/userRegister'), require('./controllers/userRegister'))
//load login page
app.use('/login',  require('./middlewares/userLogin'), require('./controllers/userLogin'))
//store new post
app.use('/posts/new', require('./middlewares/newPost'), require('./controllers/newPost'))
//reset password
app.use('/reset', require('./middlewares/resetPass'), require('./controllers/resetPass'))

app.post('/reset-link', require('./middlewares/resetLink'), require('./controllers/resetLink'))

//search for a post using the title
app.get('/search', require('./controllers/search'))

//delete a single post require('./controllers/deletePost')
app.get('/post/delete/', require('./controllers/deletePost'))

//get a single post
app.get('/post/:title/', require('./controllers/singlePost'))

//get user posts
app.get('/posts', async (req, res) => {
    //check if user is logged in
    if (!req.session || !req.session.userId)
        return res.redirect('/login')

    const posts = await Post.find({
        userId: req.session.userId
    })
    //check if there is a data for this page in the session
    const sessionData = req.session?.postsPage
    //delete if there was a data
    if(sessionData) delete req.session.postsPage
    return res.render('posts', {
        posts, 
        sessionData
    })
})

//serch for users posts
app.get('/posts/search', async (req, res) => {
    try {
        //check if user is logged in
        if(!req.session?.userId) return res.redirect('../login?next=posts')
        //get posts created by the user
        const posts = await Post.find({
            title: new RegExp(req.query.title, 'i'),
            userId : req.session.userId
        })

        const user = await User.findById(req.session.userId)

        const output = []

        posts.map(item => {
            //store output
            output.push({
                title : item.title,
                content : item.content,
                datePosted : item.datePosted,
                username : user?.username
            })
        })

        return res.render('posts', { posts : output, base : "../", title : req.query.title || ''})

    } catch (err) {
        console.error(err)
    }
})

//user logout
app.get('/logout', (req, res) => {
    //destroy session
    req.session.destroy(() => {
        //reset global var
        loggedIn = false
        return res.redirect('/')
    })
})

//user account
app.use('/account', require('./middlewares/updateAccount'), require('./controllers/updateAccount'))
//reset password
//app.use('/reset', require('./middlewares/resetPass'), require('./controllers/resetPass'))

app.get('/search', require('./controllers/search'))
//register 404 page
//must be the last stuff
app.use((req, res) => {
    return res.render('404')
})

app.listen(port, () => {
    database()
    console.log("App is live")
})