//import user model
const User = require('../models/userModel')

module.exports = async (req, res) => {
    //redirect userstohomepage if they are loggedin
    if (req.session && req.session.userId)
        return res.redirect('./');

    if (req.method == "POST") {
        try {
            //check if password reset data is stored in session
            if (!req.session || !req.session.resetPass)
                return res.redirect('reset')
            //query user
            const user = await User.findOne({ email: req.session.resetPass.email })
            //check if user exists
            if (user) {
                //create a new user object and generate hash
                const updateUser = new User(user)

                //check if hash is correct
                if (!updateUser.verifyPasswordResetHash(req.session.resetPass.hash))
                    return res.redirect('reset')

                //hash password
                updateUser.hashPassword(req.body.conpass);

                //update user record
                await User.updateOne({ email: user.email }, {
                    hash: updateUser.hash,
                    salt: updateUser.salt
                })
                //i should send a mail too
                return res.status(200).redirect('login?success=true')
            } else {
                return res.status(400).render('reset', {
                    success: false,
                    message: "You have provided an Invalid Link"
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(500).render('reset', {
                success: false,
                message: "A server error has occured"
            })
        }
    } else {
        try {
            //check if to display password reset fields
            if (req?.query && req.query.email && req.query.hash) {
                //check if link is valid or not
                const user = await User.findOne({ email: req.query.email })
                //check if user exists    
                if (user) {
                    //verify id which is the hash
                    if (user.verifyPasswordResetHash(req.query.hash)) {
                        //store password reset data in session for post request
                        req.session.resetPass = { email: user.email, hash: req.query.hash }
                        //display pasword reset form
                        return res.render('newPassForm', {
                            success: true,
                            message: "Please reset your password",
                            formData: JSON.stringify({ email: user.email })
                        })
                    } else {
                        return res.render('reset', {
                            success: false,
                            message: "You have provided an Invalid Link"
                        })
                    }
                } else {
                    return res.status(400).render('reset', {
                        success: false,
                        message: "You have provided an Invalid Link"
                    })
                }
            } else {
                //show password reset link request form
                return res.render('reset')
            }

        } catch (err) {
            console.log(err);
            return res.status(500).render('reset', {
                success: false,
                message: "A server error has occured"
            })
        }

    }
}