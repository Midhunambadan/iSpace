const mongoose=require('mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/iSpace");


const category = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    listedDate:{
        type:Date,
        default:Date.now
    },

    offer:{
        name:{
            type:String,
            
        },
        offerPercentage:{
           type:Number,
           default:0
        },
        validity:{
            type: Date   
        },
        isActive:{
            type:Boolean,
            default:true

        }
    }

});

module.exports = mongoose.model("Category", category);