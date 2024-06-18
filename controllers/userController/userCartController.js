 const Cart=require('../../models/cartModel')
 const Product=require('../../models/productModel')
 const User=require('../../models/userModel')
 const Address=require('../../models/addressModel')
 const Order=require('../../models/orderModel')
 const Wallet=require('../../models/walletModel')
 const Coupon=require('../../models/couponModel')
 const Wishlist=require('../../models/wishlistModel')


 // userCart

const loadUserCart = async (req, res) => {
    try {

      const userId=req.session.user_id

      
      // const wishlist = await Wishlist.findOne({ userId });
      // const wishlistProductCount = wishlist.products.length;

      
      // const carts = await Cart.findOne({ userId });
     
      // const cartProductCount = carts.product.length;


      const loginData = await User.findById(userId)

      // console.log(loginData);
     const Data= await Cart.findOne({userId:userId}).populate('userId').populate('product.productId')
    
     const cart = await Cart.findOne({userId:userId})

      res.render("userCart",{cartData:Data,cart});

    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  // ==================================================================================================================

  const addToCart=async(req,res)=>{
    try {
      const{productId,quantity}=req.body
      const userId= req.session.user_id

      let productData = await Product.findOne({_id:productId})
            
      if(quantity <= productData.stock) {
            
                    let userCart= await Cart.findOne({userId})
                    if(!userCart){
                        userCart= new Cart({
                            userId:userId,
                            product:[]
                        })
                    }
 
                    const existingProduct = userCart.product.find(product => product.productId == productId);


                if (existingProduct) {
                    
                    existingProduct.quantity += quantity;
                    
                } else {
                    
                    userCart.product.push({ productId, quantity });
                }
                             
                await userCart.save();

                res.status(201).json({ success:true, message: 'Item added to cart successfully' });
            } else {
                console.log('OUT OF STOCK')
                res.status(200).json({ success:false, message: 'Out of stock' });
            }
        
    } catch (error) {
      
    }
  }





  const deleteCart=async(req,res)=>{
    try {
      const  productId  = req.query.id;
      const userId = req.session.user_id;

      const userCartData = await Cart.find({ userId: userId })

     const cartData= await Cart.updateOne(
          { userId:userId },
          { $pull: { product: { productId:productId } } }
      );
      


      res.redirect('/user-cart');
      
    } catch (error) {
      
    }
  }



  const updateQuantity=async(req,res)=>{

    try {
      const productId = req.query.id;
      const quantity = req.query.quantity;
    
  } catch (error) {
      console.error(error);
     
  }

  }


  const updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.session.user_id;
        let userCart = await Cart.findOne({ userId });

        const productInCart = userCart.product.find((product)=>{
          return product.productId == productId
        })
        console.log(( productInCart.quantity + quantity))
        const productData = await Product.findById(productId)
        if( productData.stock >= ( productInCart.quantity + quantity) &&  ( productInCart.quantity + quantity) > 0 ) {
        
            
        const productIndex = userCart.product.findIndex(item => item.productId.toString() === productId);
                userCart.product[productIndex].quantity += quantity;
       const updateProduct=  await userCart.save();
       if(updateProduct){
       return res.status(200).json({ message: 'Cart updated successfully' });

       }


        } else {
     return   res.status(500).json({ message: 'out of stock '});

        }
       return res.status(500).json({ message: 'something went wrong' });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




  
const userCheckout=async(req,res)=>{
  try {

    
    const userId=req.session.user_id

    const couponData= await Coupon.find()
    
    const cartData=await Cart.find({userId:userId}).populate('product.productId')

    const addressData = await Address.find({ user: userId }).populate('user');


    res.render('checkOut',{address:addressData,cart:cartData[0],coupon:couponData})

  } catch (error) {
    
  }
}





const insertCheckoutAddress = async (req, res) => {
  try {

      const userId = req.session.user_id
      const { name, mobile, houseName, street, city, state, pincode } = req.body;
      const user = await User.findById(userId)

      if(!user){
          return
      }
      const address = new Address({
          user: userId, 
          name: name,
          mobile: mobile,
          houseName: houseName,
          street: street,
          city: city,
          state: state,
          pincode: pincode
      });

      // Save the address to the database
      await address.save();

      res.redirect('/checkout')

  } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
  }
}




const deleteCheckoutAddress=async(req,res)=>{
  try {
    
    const id =req.params.id
    const updateAddress=  await Address.findByIdAndDelete(id);

  
    res.json({success : true})

  } catch (error) {
    
  }
}


const editCheckoutAddress = async (req, res) => {
  try {
    const id = req.query.id;
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii', id);

    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).send('Address not found');
    }

    console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", address);

    res.render('editCheckOutAddress', { address });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}


const verifyEditCheckoutAddress=async(req,res)=>{
  try {

    const userId = req.session.user_id
    const { name, mobile, houseName, street, city, state, pincode } = req.body;
    const user = await User.findById(userId)

    // console.log('req.body---------------',req.body,user);

    if(!user){
        return
    }
    const address = new Address({
        user: userId, 
        name: name,
        mobile: mobile,
        houseName: houseName,
        street: street,
        city: city,
        state: state,
        pincode: pincode
    });

    console.log('addresssssssss',address);
    // Save the address to the database
    await address.save();
    
    res.redirect('/checkout')
  } catch (error) {
    
  }
}





const applyCoupon=async(req,res)=>{
  try {
    
    const {couponCode,selectedAmount}=req.body

 

    const userId = req.session.user_id;
    const coupon = await Coupon.findOne({ code: couponCode, is_active: true, validUntil: { $gte: Date.now() } });

    if (!coupon) {
      return res.status(200).json({
          success: false,
          message: 'Coupon not found or expired.'
      });
  }else{
  }

  const userRedeemed = coupon.redeemedUsers.find(user => user.userId === userId);
  if (userRedeemed) {
    
    return res.status(200).json({
        success: false,
        message: 'Coupon has already been redeemed by the user.'
    });
}else{}



if (selectedAmount < coupon.minimumAmount) {

  return res.status(200).json({
      success: false,
      message: 'Selectected Coupon is not applicable for this price'

  });
}else{

  coupon.redeemedUsers.push({ userId: userId, usedTime: new Date() });
  coupon.timesUsed++;
  await coupon.save();
}

return res.status(200).json({
  success: true,
  message: 'Coupon applied successfully.',
  couponName: coupon.name,
  discountAmount: coupon.discountpercentage
});


  } catch (error) {
    
  }
}


const removeCoupon=async(req,res)=>{
  try {
    const {couponCode}=req.body
    const userId=req.session.user_id


    const updatedCoupon = await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $pull: { redeemedUsers: { userId: userId } } }, // Pull the user ID from the redeemedUsers array
      { new: true } // To return the updated document
  );


  if (updatedCoupon) {
    console.log("Coupon updated successfully:", updatedCoupon);
    // Handle success if needed
} else {
    console.log("Coupon not found or user not redeemed it:", couponCode);
    // Handle not found or user not redeemed the coupon
}

res.redirect('/checkout');


  } catch (error) {
    
  }
}







  
  module.exports={
    loadUserCart,
    addToCart,
    deleteCart,
    userCheckout,
    updateQuantity,
    updateCart,

    insertCheckoutAddress,
    deleteCheckoutAddress,
    editCheckoutAddress,
    verifyEditCheckoutAddress,

    applyCoupon,
    removeCoupon
    
  }