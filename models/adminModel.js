const mongoose=require('mongoose')
const { stringify } = require("uuid");

// mongoose.connect('mongodb://127.0.0.1:27017/iSpace')


const admin =mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin: {
        type:Boolean,
        default:false,
        required: true
      }
})

module.exports = mongoose.model("Admin",admin);



