const mongoose=require('mongoose')
const Schema = mongoose.Schema;

const addressSchema=mongoose.Schema({


    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    mobile: String,
    houseName: String,
    name: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    createdDate: {
      type: Date,
      default: Date.now,
    }



})

module.exports=mongoose.model("Address",addressSchema)