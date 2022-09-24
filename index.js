const express = require('express')
const ejs = require('ejs')
const session = require('express-session')
//import blog post model
const Post = require('./models/postModel')
//import user model
const User = require('./models/userModel')
const multer = require('multer')
const fileUpload = require('express-fileupload')
const database = require('./utils/database')

const app = express()
const port = process.env.PORT || 5000

//parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: true }))
//parse json bodies (as sent by api clients)
app.use(express.json())
//load static files
app.use('/assets', express.static('./assets'));
//register the package in express
app.use(fileUpload())
//register custom validate middleware for the posts/new request
app.use( '/posts/new', require('./middlewares/validateMiddleWare'))
//register session in express
app.use(session({
    secret : 'First Nodejs Project',
    resave : true,
    saveUninitialized : true
}))
//set userid if user is logged in or not
global.loggedIn = false;
//send loggedIn var to all pages
app.use("*", (req, res, next) => {
    if(req.session && req.session.userId)
        loggedIn = true;

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
    await Promise.all(posts.map( async (item) => {
        const user  = await User.findOne({_id:item.userId})
        output.push({
            title: item.title,
            subtitle : item.subtitle,
            content: item.content,
            datePosted : item.datePosted,
            username : user?.username,
            cover : item.cover
        })
    }))
    let loggedInData = undefined

    if(req.session && req.session.loggedInData) {
        loggedInData = JSON.parse(req.session.loggedInData)
        delete req.session.loggedInData
    } 
    
    return res.render('index', { posts : output, loggedInData })
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
app.get('/register', require('./controllers/userRegister'))
//load login page
app.get('/login', require('./controllers/userLogin'))
//load new post page
app.get('/posts/new', require('./controllers/newPost'))
//search for a post using the title
app.get('/search', require('./controllers/search'))
//get a single post
app.get('/post/:title', require('./controllers/singlePost'))

//user registration
app.post('/register', require('./controllers/userRegister'))
//store new post
app.post('/posts/new',  require('./controllers/newPost'))
//user login
app.post('/login', require('./controllers/userLogin'))
//user logout
app.get('/logout', (req, res) => {
    //destroy session
    req.session.destroy( () => {
        //reset global var
        loggedIn = false
        return res.redirect('/')
    })
})
//register 404 page
//must be the last stuff
app.use((req, res) => {
    return res.render('404')
})

app.listen(port, () => {
    database()
    console.log("App is live")
})