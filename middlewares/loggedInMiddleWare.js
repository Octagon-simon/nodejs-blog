/**
 * checks if user is logged in by the presence of userid in the session then redirects to the homepage
 */

//import user model
const User = require('../models/userModel')

//export middleware
module.exports = (req, res, next) => {
    //check if userId exists in session
    if(req.session && req.session.userId){
        //go back to homepage
        return res.redirect('/')
    }
    //call next middleware 
    next()
}