//import library
const octavalidate = require('./octaValidate')
//init class
const validate =  new octavalidate('form_new_post')

//validation rules for fields
const FieldRules = {
    title : {
        'R' : "Post Title is required!",
        'TEXT': "Post Title contains invalid characters"
    },
    subtitle : {
        'R' : "Post subtitle is required!",
        'TEXT': "Post Subtitle contains invalid characters"
    },
    content : {
        'R' : "Post content is required!"
    }
}
//validation rules for files
const FileRules = {
    cover : {
        'R' : "Post Cover Image is required!",
        'ACCEPT' : ['image/*', "Please upload an image file"]
    }
}
module.exports = (req, res, next) => {
    try {
        //check if request method is POST
        if (req.method == "POST") {
            const fieldVal = validate.validateFields(FieldRules)
            const fileVal = validate.validateFiles(FileRules)
            if (!(fieldVal && fileVal)) {
                return res.render('newPost',
                    {
                        success: false,
                        message: "Form validation failed",
                        base: "../",
                        formErrors: JSON.stringify(validate.getErrors()),
                        formData: JSON.stringify(req.body)
                    })
            }
        }
    } catch (err) {
        console.log(err)
        return res.status(500).render('login', {
            success: false,
            message: "A server error has occured"
        })
    }
    next()
}