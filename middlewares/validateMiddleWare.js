module.exports = (req, res, next) => {
    //check if request method is POST
    if (req.method == "POST") {
        if (!req.files || !req.body.title || !req.body.subtitle) {
            return res.render('newPost', { success: false, message: "Form validation failed", base: "../" })
        }
    }
    next()
}