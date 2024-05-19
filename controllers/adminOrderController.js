

const User=require('../models/userModel')
const Address = require('../models/addressModel');
const Order=require('../models/orderModel')
const Product=require('../models/productModel')

const orderPage=async(req,res)=>{
    try {

        const orderData=await Order.find().sort({orderDate:-1});

        console.log('orderdddddddddddddddddd',orderData);

        res.render('orderPage',{orders:orderData})
    } catch (error) {
        
    }
}


const orderDetailsPage=async(req,res)=>{
    try {

        const orderId=req.query.id
        // console.log(orderId,'oderId');
        const orderData=await Order.find({_id:orderId}).sort({orderDate:-1}).populate('userId').populate('products.productId');
        console.log(orderData);
        res.render('orderDetailsPage',{orders:orderData})
    } catch (error) {
        
    }
}



const orderStatusChange=async(req,res)=>{
    try {
       
        const { orderId, orderStatus } = req.body;
        
      const orderData=  await Order.findByIdAndUpdate(orderId, { orderStatus });

        console.log(orderData,'==================--------------------=============');
        

        res.redirect('/admin/orders');
    } catch (error) {
        
    }
}


// app.post('/update-order-status', async (req, res) => {
    

//     try {
//         // Update the order status in the database
//         await Order.findByIdAndUpdate(orderId, { orderStatus });

//         // Redirect or send a response back
//         res.redirect('/orders');  // Adjust the redirect URL as needed
//     } catch (error) {
//         console.error('Error updating order status:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });








module.exports = {
    orderPage,
    orderDetailsPage,
    orderStatusChange
  };