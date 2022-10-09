//import library
const octavalidate = require('./octaValidate')
//init class
const validate =  new octavalidate('form_reset')

//validation rules for fields
const FieldRules = {
    pass : {
        'R' : "Your new password is required",
        'MINLENGHT': [8, 'Your password must have a minimum of 8 characters']
    },
    conpass : {
        'EQUALTO': ['pass', 'Both passwords do not match']
    }
}

module.exports = (req, res, next) => {
    try {
        if(req.session && req.session.resetPass && req.session.resetPass.email)
            req.body['email'] = req.session.resetPass.email
        //check if request method is POST
        if (req.method == "POST") {
            if (!validate.validateFields(FieldRules, req.body)) {
                return res.render('resetForm',
                    {
                        success: false,
                        message: "Form validation failed",
                        formErrors: JSON.stringify(validate.getErrors()),
                        formData: JSON.stringify(req.body)
                    })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).render('resetForm', {
            success: false,
            message: "A server error has occured"
        })
    }
    next()
}