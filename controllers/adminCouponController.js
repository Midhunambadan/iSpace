
const Coupon=require('../models/couponModel')

const loadCoupon=async(req,res)=>{
    try {
        const couponData= await Coupon.find()
        res.render('couponPage',{coupons:couponData})
    } catch (error) {
        
    }
}



const addCoupon=async(req,res)=>{
    try {

        const {code,discountpercentage,minimumAmount,validUntil}=req.body

        console.log('datasss----------------',req.body);

        const coupon = new Coupon({
           
            code: code,
            discountpercentage:discountpercentage,
            minimumAmount:minimumAmount,
            validUntil:validUntil

          });
          console.log('coupon-----------------',coupon);



          await coupon.save();
          console.log('coupondddddddddddddddddddd-----------------',coupon);


        //   console.log('couponData----------',couponData);
    
          res.redirect('/admin/load-coupon')


    } catch (error) {
        
    }
}



const deleteCoupon=async(req,res)=>{
    try {
        
        const id=req.query.id

        const coupon=await Coupon.findByIdAndDelete(id)

        res.redirect('/admin/load-coupon')

    } catch (error) {
        
    }
}

const couponBlock=async(req,res)=>{
    try {
        const id =req.query.id

        await Coupon.findByIdAndUpdate(id,{is_active:false})
        res.redirect('/admin/load-coupon')
        
    } catch (error) {
        
    }
}



const editCoupon = async (req,res) => {
    try {
        const id = req.query.id;
        const coupon = await Coupon.findById(id); // Find the coupon by ID

        console.log(coupon,'---------------------');
        if (coupon) {

            req.session.editCouponId = id;
            res.render('editCoupon', { coupon }); // Pass the coupon data to the view
        } else {
            res.status(404).send('Coupon not found'); // Send a 404 response if the coupon is not found
        }
    } catch (error) {
        console.error('Error fetching coupon:', error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Send a 500 response in case of an error
    }
};




module.exports={
    loadCoupon,
    addCoupon,
    deleteCoupon,
    couponBlock,
    editCoupon
}