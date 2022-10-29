const mongoose = require('mongoose')

async function database(){
    try{
        mongoose.connection.on('open', () => {
            console.log("Database connected")
        })
        //or {dbName : "LoginDB"}
        await mongoose.connect("mongodb://127.0.0.1:27017/BlogDB")
    }catch(err){
        console.log(err)
    }
} 
module.exports = database