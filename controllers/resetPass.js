//import user model
const User = require('../models/userModel')

module.exports = async(req, res) => {
    //redirect userstohomepage if they are loggedin
    if(req.session && req.session.userId)
        return res.redirect('./');

    if(req.method == "POST"){
        return
        try{
            //quer user
            const user = await User.findOne({email : req.body.email})
            //check if user exists
            if(user){
                //create a new user object and generate hash
                const resetLink = new User().passwordResetHash(user.email+user.hash)
                //i should  a mail
                return res.status(200).json({
                    success: true,
                    link : `http:/localhost:${PORT}/reset?email=${user.email}&id=${resetLink}`
                })

            }
        }catch(err){
            console.log(err)
            return res.status(500).render('reset', {
                success : false,
                message: "A server error has occured"
            })
        }
    }else{
        //check if to display password reset fields
        if(req?.query && req.query.email && req.query.id){
            //check if link is valid or not
            User.findOne({email:req.query.email}, async(err, user) => {
                if(user){
                    //verify id which is the hash
                    if(user.checkpasswordResetHash(user.email+user.hash)){
                       // return res.render
                    }
                }else{
                    return res.status(400).json({
                        success : false,
                        message : "Invalid Link"
                    })
                }
            })
            return res.render('reset-pass')
        }

        return res.render('reset')
    }
}