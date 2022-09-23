/**
 * checks if user is logged in or not by the presence of userid in the session
 */

//import user model
const User = require('../models/userModel')

//export middleware
module.exports = (req, res, next) => {
    //check if ID exists in the database
    User.findById(req.session.userId, (err, user) => {
        //if there's an error or user data does not exist
        if (err || !user){
            return res.redirect('/register')
        }
    })
    //call next middleware 
    next()
}