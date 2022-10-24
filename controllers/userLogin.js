//import user model
const User = require('../models/userModel')
//ask him how to send message to frontend like login successful
module.exports = (req, res) => {
    //check if session exists
    if( req.session && req.session.userId)
        //redirect to home page if session exists
        return res.redirect('/')
    if(req.method == "POST"){
        //handle user login
    try {
        const postData = Object.assign({}, req.body)
        //check if email address exists already
        User.findOne({ email: postData.email }, (err, user) => {
            if (err)
                new Error(err)
            //check if user exists andn there's no error
            if (!err && user) {
                //compare user's hash with new hash
                if (user.checkPassword(postData.pass)) {
                    //set user id as session value
                    req.session.userId = user._id;
                    req.session.loggedInData = JSON.stringify({success : true, message : "Login successful", loggedInTime : new Date().getTime()})
                    //check if we should automatically redirect to a page or go to home page
                    
                    if(redirect){
                        return res.redirect(redirect)
                    }
                    return res.redirect('/')
                    /*
                    return res.status(200).json({
                        success: true,
                        message: "Login Successful"
                    })*/
                } else {
                    
                    return res.render('login', {
                        success: false,
                        message: "Username or Password is Invalid"
                    })/*
                    return res.status(401).json({
                        success: false,
                        message: "Username or Password is Invalid"
                    })*/
                }
            } else {
                //why not return to registration page
                
                return res.render('login', {
                    success: false,
                    message: "User does not exist"
                })/*
                return res.status(401).json({
                    success: false,
                    message: "User does not exist"
                })*/
            }
        })

    } catch (err) {
        console.log(err)
        return res.render('login', {
            success: false,
            message: "A Server error has occured"
        })
    }
    }else{
        //check if login isredirected after a password reset
        if(req.query && req.query?.success && req.session?.resetPass){
            //remove query 
            delete req.query.success
            //remove reset pass object from session
            delete req.session.resetPass

            return res.render('login', {
                success: true,
                message: "Your password has been updated"
            })
        }
        return res.render('login')
    }
}