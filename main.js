const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const port = process.env.PORT || 5000

//parse url encoded bodies (as sent by html forms)
app.use(express.urlencoded({ extended: true }))
//parse json bodies (as sent by api clients)
app.use(express.json())
//use file upload
app.use(fileUpload())

const octaValidate =  require('./middlewares/octaValidate')

const validate = new octaValidate("form_login", {
    strictMode: true,
    strictWords: ["admin", "user", "test"]
})

validate.moreCustomRules({'EG' : [/^12345$/, 'ENTER 12345']})

const valRules = {
    username: {
        'R': "Your username is required",
        'USERNAME': "Please provide a valid username",
        'LENGTH': [5, "Please provide 5 characters"],
        'EG' : ''
    },
    password: {
        'R': "Your pass is required",
        'PWD': "Please provide a strong password",
        'MINLENGTH': [8, "Please provide 8 characters or more"]
    }
}

const valRules2 = {
    pic: {
        'R': "Your pic is required",
        'MINSIZE' : ["3mb", "provide a minimum of 3MB file"]
    },
    pic2: {
        'R': "Your pic2 is required",
        'FILES' :[2, "2 files are required"],
        'ACCEPT' : ["audio/*", "audio files only"]
    }
}
//what of input types like text, array, json, ip
/*
const vmw = (req, res, next) =>{
    if(!validate.validate(req.body, valRules)){
        console.log(validate.getErrors())
    }
    next();
}
*/
app.get('/test', (req, res)=>{
    res.sendFile(__dirname+'/pages/test.html')
})
app.post('/test',(req, res) =>{
    if(!validate.validateFiles(req.files, valRules2)){
        res.status(400).json(validate.getErrors())
    }
    res.end()
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})