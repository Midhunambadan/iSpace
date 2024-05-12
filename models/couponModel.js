const mongoose = require('mongoose');


const couponModel = new mongoose.Schema({

    name:{type:String,
        required:true,
        unique:true
    },
    code: { type: String,
         required: true, 
         unique: true  
        },
    discountpercentage: { 
        type: Number, 
        required: true 
     },
    minimumAmount: { 
        type: Number,
        required: true 
        },
    validUntil: { 
        type: Date,
        required: true 
         },
    is_active: {
         type: Boolean, 
        default: true
     },
    maxPerUser:{
        type:Number,
        default:1
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    timesUsed: { 
        type: Number, 
        default:1 
    },

    redeemedUsers:[{
        userId:{type:String},
        usedTime:{type:Date}
    }],

});


module.exports=mongoose.model("Coupon",couponModel)