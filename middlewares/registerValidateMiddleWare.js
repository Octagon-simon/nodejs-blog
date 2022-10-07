//import library
const octavalidate = require('./octaValidate')
//init class
const validate =  new octavalidate('form_register', {
    strictMode : true,
    strictWords : ["admin", "test", "empty"]
})

//validation rules for fields
const FieldRules = {
    uname : {
        'R' : "Your username is required!",
        'USERNAME' : "The Username provided is invalid!"
    },
    email : {
        'R' : "Your Email Address is required!",
        'EMAIL' : "The Email Address provided is invalid!"
    },
    pass : {
        'R' : "Your Password is required!",
        'MINLENGTH' : [8, "Password must have a minimum of 8 characters"],
        'EQUALTO': ["conPass", "Both passwords do not match"]
    }
}

module.exports = (req, res, next) => {
    try{
        //check if request method is POST
        if (req.method == "POST") {
            if (! (validate.validateFields(FieldRules)) ) {
                return res.render('register', 
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