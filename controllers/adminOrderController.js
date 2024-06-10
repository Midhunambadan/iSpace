

const User=require('../models/userModel')
const Address = require('../models/addressModel');
const Order=require('../models/orderModel')
const Product=require('../models/productModel')

const orderPage=async(req,res)=>{
    try {

        const orderData=await Order.find().sort({orderDate:-1});


        res.render('orderPage',{orders:orderData})
    } catch (error) {
        
    }
}




const orderDetailsPage = async (req, res) => {
    try {
        const orderId = req.query.id;
        const orderData = await Order.findById(orderId).populate('userId').populate('products.productId');
        res.render('orderDetailsPage', { orders: orderData ? [orderData] : [] });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};




const orderStatusChange=async(req,res)=>{
    try {
       
        const { orderId, orderStatus } = req.body;


        if(orderStatus=='Delivered'){
            const orderData=  await Order.findByIdAndUpdate(orderId, { $set:{orderStatus:orderStatus,paymentStatus:'Recieved' }},{new:true});
        }else{
            const orderData=  await Order.findByIdAndUpdate(orderId, { orderStatus});

        }
        
        res.redirect('/admin/orders');
    } catch (error) {
        
    }
}




module.exports = {
    orderPage,
    orderDetailsPage,
    orderStatusChange
  };