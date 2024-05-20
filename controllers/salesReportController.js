
const Order=require('../models/orderModel')

const loadSalesReport=async(req,res)=>{
    try {
        const totalOrder=await Order.find({orderStatus:'Delivered'}).populate('userId')

        res.render('salesReport',{totalOrder})
    } catch (error) {
        
    }
}

module.exports={
    loadSalesReport
}