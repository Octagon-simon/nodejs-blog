//import library
const octavalidate = require('./octaValidate')
//init class
const validate =  new octavalidate('form_login')

//validation rules for fields
const FieldRules = {
    email : {
        'R' : "Your Email Address is required!",
        'EMAIL' : "The Email Address provided is invalid!"
    },
    pass : {
        'R' : "Your Password is required!",
        'MINLENGTH' : [8, "Password must have a minimum of 8 characters"]
    }
}

module.exports = (req, res, next) => {
    //check if request method is POST
    try{
        if (req.method == "POST") {
            if (! (validate.validateFields(FieldRules, req.body)) ) {
                return res.render('login', 
                { 
                    success: false, 
                    message: "Form validation failed", 
                    formErrors : JSON.stringify(validate.getErrors()), 
                    formData : JSON.stringify(req.body)
                })
            }
        }
    }catch(err){
        console.log(err)
        return res.status(500).render('login', {
            success : false,
            message : "A server error has occured"
        })
    }
    next()
}