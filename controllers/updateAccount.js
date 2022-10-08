const User = require('../models/userModel')
const path = require('path')
//fake filler
module.exports = async (req, res) => {
    //redirect to login page when session is not found
    if (!req.session || !req.session.userId)
        return res.redirect('login?next=account')

    if (req.method == "POST") {

        try {
            //instance of the user model
            const user = new User()
            if (req.body.uname)
                user['username'] = req.body.uname
            if (req.body.pass && req.body.conpass)
                user.hashPassword(req.body.conpass)
            if (req.files && Object.keys(req.files).length && typeof req.files.profile !== "undefined") {
                const profileImage = req.files.profile

                await profileImage.mv(path.resolve(__dirname, '../uploads/', profileImage.name))

                user['profile'] = `/uploads/${profileImage.name}`
            }

            await User.findOneAndUpdate({ _id: req.session.userId }, {
                username: user.username,
                hash: user.hash,
                salt: user.salt,
                profile: user.profile
            });

            const userData = await User.findById({
                _id: req.session.userId
            })

            return res.status(200).render('account', {
                success: true,
                message: "Account Updated Successfully",
                user: {
                    username: userData.username,
                    profile: userData.profile,
                    email: userData.email
                }
            })
        } catch (err) {
            console.log(err)
            return res.status(500).render('account', {
                success: false,
                message: "A server error has occured"
            })
        }
    } else {

        try {
            const user = await User.findById({
                _id: req.session.userId
            })

            return res.status(200).render('account', {
                success: true,
                user: {
                    username: user.username,
                    profile: user?.profile,
                    email: user.email
                }
            })
        } catch (err) {
            console.log(err)
            return res.status(500).render('account', {
                success: false,
                message: "A server error has occured"
            })
        }
    }
}