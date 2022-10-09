//import library
const octavalidate = require('./octaValidate')
//init class
const validate =  new octavalidate('form_reset_link')

//validation rules for fields
const FieldRules = {
    email : {
        'R' : "Your Email Address is required!",
        'EMAIL': "Your Email Address is invalid"
    }
}

module.exports = (req, res, next) => {
    try {
        //check if request method is POST
        if (req.method == "POST") {
            if (!validate.validateFields(FieldRules, req.body)) {
                return res.render('reset',
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
        return res.status(500).render('reset', {
            success: false,
            message: "A server error has occured"
        })
    }
    next()
}