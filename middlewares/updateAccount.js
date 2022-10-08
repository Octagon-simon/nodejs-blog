const octaValidate = require('./octaValidate')

const fieldRules = {
    uname : {
        'USERNAME' : "Your username is invalid"
    },
    conpass : {
        'EQUALTO' : ['pass', "Both passwords do not match"],
        'MINLENGTH' : [8, "Your password must have a minimum of 8 characters"]
    }
}

const fileRules = {
    profile : {
        'ACCEPT-MIME' : ['image/*', "File type is not supported"]
    }
}

const validate = new octaValidate("form_update_account", {
    strictMode: true,
    strictWords: ["admin", "user", "test", "fake"]
})

module.exports = async(req, res, next) => {
    try {
        //check if request method is POST
        if (req.method == "POST") {
            const fieldVal = validate.validateFields(fieldRules, req.body)
            const fileVal = validate.validateFiles(fileRules, req.files)
            if (!(fieldVal && fileVal)) {
                return res.render('account',
                    {
                        success: false,
                        message: "Form validation failed",
                        formErrors: JSON.stringify(validate.getErrors()),
                        formData: JSON.stringify({uname : req.body.uname, pass : req.body.pass})
                    })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).render('account', {
            success: false,
            message: "A server error has occured"
        })
    }
    next()
}