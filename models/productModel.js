const mongoose=require('mongoose')
const {ObjectId}=require('mongodb')

// mongoose.connect("mongodb://127.0.0.1:27017/iSpace")


const product= new mongoose.Schema({

    product_name: String,
    discription:String,
    MRP:Number,
    stock: Number,
    productImages:{
        type:Array
    }, 
    discount:Number,
    isActive:{
        type:Boolean,
        required:true,
        default:true

    },
    listedDate:{
        type:Date,
        default:Date.now
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,ref:'Category',
        required:true
    }
})


module.exports=mongoose.model('Product',product)
