
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

        const {name,code,discountpercentage,minimumAmount,validUntil}=req.body

        console.log('datasss----------------',req.body);

        const coupon = new Coupon({
            name: name,
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




module.exports={
    loadCoupon,
    addCoupon,
    deleteCoupon,
    couponBlock
}