 const Cart=require('../models/cartModel')
 const Product=require('../models/productModel')
 const User=require('../models/userModel')
 const Address=require('../models/addressModel')
 const Order=require('../models/orderModel')
 const Wallet=require('../models/walletModel')
 const Coupon=require('../models/couponModel')


 // userCart

const loadUserCart = async (req, res) => {
    try {

      const userId=req.session.user_id

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



//   const addToCart = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const userId = req.session.user_id;

//         let product = await Product.findOne({ _id: productId });
//         if (!product) {
//             return res.status(404).json({ success: false, error: 'Product not found' });
//         }

//         let cart = await Cart.findOne({ userId });
//         if (!cart) {
//             cart = new Cart({
//                 userId: userId,
//                 product: []
//             });
//         }

//         const existingProductIndex = cart.product.findIndex(item => item.productId.toString() === productId);
//         if (existingProductIndex !== -1) {
//             const totalQuantity = cart.product[existingProductIndex].quantity + 1;
//             console.log('------------totalQuanttiy',totalQuantity);
//             if (totalQuantity > product.stock) {
              
//                 return res.status(400).json({ success: false, error: 'Cannot add more items than available stock' });
//             }
//             cart.product[existingProductIndex].quantity = totalQuantity;
//         } else {
//             if (1 > product.stock) {
//                 return res.status(400).json({ success: false, error: 'Cannot add more items than available stock' });
//             }
//             cart.product.push({ productId, quantity: 1, price: product.saleprice });
//         }

//         await cart.save();

//         res.status(201).json({ success: true, message: 'Item added to cart successfully' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ success: false, error: 'Internal server error' });
//     }
// };




  const deleteCart=async(req,res)=>{
    try {
      const  productId  = req.query.id;
      const userId = req.session.user_id;

      const userCartData = await Cart.find({ userId: userId })

      // console.log('=============================================productId',req.query.id);
     const cartData= await Cart.updateOne(
          { userId:userId },
          { $pull: { product: { productId:productId } } }
      );
      

      // console.log('====================================Cartdata',cartData);

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
        console.log(userCart)

        const productInCart = userCart.product.find((product)=>{
          return product.productId == productId
        })
        console.log("product in cart",productInCart)
        console.log(( productInCart.quantity + quantity))
        const productData = await Product.findById(productId)
        console.log("product cart",productData)
        if( productData.stock >= ( productInCart.quantity + quantity) &&  ( productInCart.quantity + quantity) > 0 ) {
          console.log("worled")
        //   productInCart.quantity+quantity
        // const updateStock=  await userCart.save()
            
        //    console.log(updateStock) 
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

        // console.log('----------------usercart',userCart.product.filter((product)=>{
        //   return product.productId == productId
        // }));
        // console.log('----------------usercart',userCart.product.find((product)=>{
        //   return product.productId == productId
        // // }).quantity);

        // if (!userCart) {
        //     userCart = new Cart({ userId, product: [] });
        // }
        



        // const productIndex = userCart.product.findIndex(item => item.productId.toString() === productId);

        // if (productIndex !== -1) {
        //     if (quantity > 0) {
        //         userCart.product[productIndex].quantity += quantity;
        //     } else if (quantity < 0 && userCart.product[productIndex].quantity + quantity > 0) {
        //         userCart.product[productIndex].quantity += quantity;
        //     } else {
        //         userCart.product.splice(productIndex, 1);
        //     }
        // } else if (quantity > 0) {
        //     userCart.product.push({ productId, quantity });
        // }

        // await userCart.save();

        // res.status(200).json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




  
const userCheckout=async(req,res)=>{
  try {

    
    const userId=req.session.user_id

    const couponData= await Coupon.find()
    // console.log('couponData-----',couponData);
    
    const cartData=await Cart.find({userId:userId}).populate('product.productId')

    const addressData = await Address.find({ user: userId }).populate('user');



    // console.log('---------------------addressData',addressData)

    // console.log('-----------------------------------',cartData)
  

    res.render('checkOut',{address:addressData,cart:cartData[0],coupon:couponData})

  } catch (error) {
    
  }
}





const insertCheckoutAddress = async (req, res) => {
  try {
      // console.log('----------------------------------------insert address controller');

      const userId = req.session.user_id
      console.log('----------------------',userId)
      const { name, mobile, houseName, street, city, state, pincode } = req.body;
      const user = await User.findById(userId)

      if(!user){
          console.log("User Not found")
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
      // res.redirect('/userDashboard')

  } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
  }
}




const deleteCheckoutAddress=async(req,res)=>{
  try {
    
    const id =req.params.id
    console.log('--------------------id',id);
    const updateAddress=  await Address.findByIdAndDelete(id);

  
    res.json({success : true})

  } catch (error) {
    
  }
}


const applyCoupon=async(req,res)=>{
  try {
    
    const {couponCode,selectedAmount}=req.body

    // console.log('couponCode.......',couponCode);
    // console.log('selectedAddres-------------',selectedAmount);

    const userId = req.session.user_id;
    const coupon = await Coupon.findOne({ code: couponCode, is_active: true, validUntil: { $gte: Date.now() } });

    if (!coupon) {
      // console.log('no coupn founddddddddd')
      return res.status(200).json({
          success: false,
          message: 'Coupon not found or expired.'
      });
  }else{
    console.log('coupon found');
  }

  const userRedeemed = coupon.redeemedUsers.find(user => user.userId === userId);
  if (userRedeemed) {
    console.log('user reedmed');
    
    return res.status(200).json({
        success: false,
        message: 'Coupon has already been redeemed by the user.'
    });
}else{
  console.log(' user not redeemed');
}



if (selectedAmount < coupon.minimumAmount) {

  console.log('not applicable for this price');
  return res.status(200).json({
      success: false,
      message: 'Selectected Coupon is not applicable for this price'

  });
}else{
  console.log('applicable');

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

    applyCoupon,
    removeCoupon
    
  }