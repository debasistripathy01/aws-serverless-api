const mongoose = require("mongoose")

const userData = new mongoose.Schema({
    name:String,
    email:String,
    gender:String,
    password:{type:String,required:true}
})
const UserModel = mongoose.model("user",userData)
// User Model Schema
module.exports = {UserModel};