

const User=require('../models/userModel')
const Address = require('../models/addressModel');
const Order=require('../models/orderModel')

const orderPage=async(req,res)=>{
    try {

        const orderData=await Order.find().sort({orderDate:-1});

        console.log('orderdddddddddddddddddd',orderData);

        res.render('orderPage',{orders:orderData})
    } catch (error) {
        
    }
}




module.exports = {
    orderPage
  };