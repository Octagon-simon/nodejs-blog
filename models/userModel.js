const mongoose = require("mongoose")
//try bcrypt
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    username: {type: String,  unique: true, required : true},
    email: {type: String, unique: true, required : true},
    hash: {type: String, required : true},
    salt: {type : String, required : true},
    profile: {type: String}
})
//how to know you're inserting to a particular collection
//create a full fledge user auth system with nodejs part 1 with password hashing
//part 2 with sessions
UserSchema.methods.hashPassword = function(password){
    //create a unique salt for particular user
    this.salt = crypto.randomBytes(16).toString('hex')

    //hash the user's salt and password with 1000 iterations
    //this.hash
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
}

UserSchema.methods.checkPassword = function(password){
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex')
    
    return this.hash === hash;
}
//store in Users collection
//if collection does not exist it will create it for you
const User = mongoose.model("User", UserSchema, 'Users')

//console.log(User);

module.exports = User;