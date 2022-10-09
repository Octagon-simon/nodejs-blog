const User = require('../models/userModel')
module.exports = async(req, res) => {
    //redirect userstohomepage if they are loggedin
    if(req.session && req.session.userId)
        return res.redirect('./');

    if(req.method == "POST"){
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
                    link : `http:/localhost:${port}/reset?email=${user.email}&id=${resetLink}`
                })
            }else{  
                return res.status(400).json({
                    success: false,
                    message: "Email address does not exist"
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
        return res.render('reset')
    }
}