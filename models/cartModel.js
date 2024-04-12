const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const cartSchema=new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true

    },
    product:[
        {

            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ]
})

module.exports=mongoose.model("Cart" , cartSchema)