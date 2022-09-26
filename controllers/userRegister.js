//import user model
const User = require('../models/userModel')

module.exports = (req, res) => {
    //check if session exists
    if (req.session && req.session.userId)
        //redirect to home page if session exists
        return res.redirect('/')
    if (req.method == "POST") {
        //handle user registration
        try {
            const postData = Object.assign({}, req.body)
            //check if email address exists already
            User.findOne({ email: postData.email }, (err, user) => {
                if (err)
                    new Error(err)
                //check if user exists
                if (user === null) {
                    const newUser = new User({
                        username: postData.uname,
                        email: postData.email
                    })
                    //hash password
                    newUser.hashPassword(postData.pass)

                    //store to db
                    newUser.save().then(savedData => {
                        if (savedData === newUser) {
                            return res.render('login', {
                                success: true,
                                message: "Account has been created"
                            })
                        } else {
                            return res.render('register', {
                                success: false,
                                message: "An Error prevented us from creating your account"
                            })
                        }
                    })


                } else {
                    return res.render('register', {
                        success: false,
                        message: "A user with this Email exists already"
                    })
                }
            })

        } catch (err) {
            return res.render('register', {
                success: false,
                message: "A server error has occured"
            })
        }
    } else {
        return res.render('register')
    }
}