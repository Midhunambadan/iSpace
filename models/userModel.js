const mongoose = require("mongoose");
const { stringify } = require("uuid");



const user = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique:true,
    required: true,
  },
  mobile: {
    type: Number,
    unique:true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive:{
    type:Boolean,
    default:true,
    
  },
  isAdmin: {
    type:Boolean,default:false,
    required: true,
  },
  registerDate:{
    type:Date,
    default:Date.now
  },
  wishlist:{
    type:mongoose.Schema.Types.ObjectId,ref:'Wishlist',
    required:true
}

  
});


module.exports = mongoose.model("User", user);
