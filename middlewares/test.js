const octaValidate =  require('octaValidate-nodejs')

const validate = new octaValidate({
    method: "post",
    strictMode: true,
    strictWords: ["admin", "user", "test"]
})

console.log(validate)