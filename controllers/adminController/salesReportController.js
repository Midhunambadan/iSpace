const Order=require('../../models/orderModel')



const loadSalesReport=async(req,res)=>{
    try {
        const {sDate,eDate}=req.body
        const totalOrder=await Order.find({orderStatus:'Delivered',paymentStatus:'Recieved'}).populate('userId')
        
console.log('totalorders',totalOrder);

        const totalSum = totalOrder.reduce((sum, order) => {
            sum= sum+parseInt(order.totalAmount)
            return sum
        },0);
        res.render('salesReport',{totalOrder,totalSum})
    } catch (error) {
        
    }
}



const searchSalesReportWithDate = async (req, res) => {
    try {
        const {start,end}=req.body


        const sDate = new Date(start);
        const eDate = new Date(end);
        
        
        // // Adjusting the end date to include the whole day
        eDate.setHours(23, 59, 59, 999);

        const totalOrder = await Order.find({
            paymentStatus: 'Recieved',
            orderStatus: 'Delivered',
            orderDate: { $gte: sDate, $lte: eDate }
        }).populate('userId');


        const totalSum = totalOrder.reduce((sum, order) => {
            sum= sum+parseInt(order.totalAmount)
            return sum
        },0);


        res.render('salesReport', { totalOrder, sDate, eDate,totalSum });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports={
    loadSalesReport,
    searchSalesReportWithDate
}