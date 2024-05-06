 const Cart=require('../models/cartModel')
 const Product=require('../models/productModel')
 const User=require('../models/userModel')
 const Address=require('../models/addressModel')
 const Order=require('../models/orderModel')
 const OrderAddress=require('../models/orderAdderss')


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

    
    const cartData=await Cart.find({userId:userId}).populate('product.productId')

    const addressData = await Address.find({ user: userId }).populate('user');



    // console.log('---------------------addressData',addressData)

    // console.log('-----------------------------------',cartData)
  

    res.render('checkOut',{address:addressData,cart:cartData[0]})

  } catch (error) {
    
  }
}




// const products=await productData.save()

// const addCheckoutAddress = async (req, res) => {
//   try {
//       const userId = req.session.user_id;
//       const user = await User.findById(userId);

//       const { name, mobile, houseName, street, city, state, pincode } = req.body;

//       const newAddress = new OrderAddress({
//           name: name,
//           mobile: mobile,
//           houseName: houseName,
//           street: street,
//           city: city,
//           state: state,
//           pincode: pincode
//       });

//       // Save the new address to the user's address array
//       // user.address.push(newAddress);

//       // const updatedUser = await order.save();

//       const updateAddress=await newAddress.save()

//       res.redirect('/checkout');
//   } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//   }
// };





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







// const placeOrder = async (req, res) => {
//   try {
//       const { paymentMethod, addressId } = req.body;

//       // Check if payment method and address ID are provided
//       if (!paymentMethod || !addressId) {
//           return res.json({ success: false, message: 'Payment method and address are required.' });
//       }

//       // Fetch address details from database using addressId
//       const address = await Address.findById(addressId);

//       if (!address) {
//           return res.json({ success: false, message: 'Invalid address ID.' });
//       }

//       // Calculate total amount based on the products in the cart
//       let totalAmount = 0;
//       for (let i = 0; i < Cart.product.length; i++) {
//           totalAmount += Cart.product[i].quantity * Cart.product[i].productId.MRP;
//       }

//       // Create a new order
//       const newOrder = new Order({
//           userId: req.user.id,
//           products: Cart.product.map(item => ({
//               productId: item.productId,
//               quantity: item.quantity,
//           })),
//           address: {
//               name: address.name,
//               mobile: address.mobile,
//               houseName: address.houseName,
//               street: address.street,
//               city: address.city,
//               state: address.state,
//               pincode: address.pincode,
//           },
//           totalAmount: totalAmount.toFixed(2),
//           paymentMethod: paymentMethod,
//       });

//       // Save the order
//       await newOrder.save();


      

//       res.json({ success: true, message: 'Order placed successfully.' });
//   } catch (error) {
//       console.error('Error:', error);
//       res.json({ success: false, message: 'Failed to place order.' });
//   }
// };








const placeOrder=async(req,res)=>{
  try {


    console.log('placeorder -------------------');

    // const orderData=req.body

    // console.log('orderData------------',orderData);

    const userId=req.session.user_id
    const addressData= await Address.find({_id:req.body.selectedAddress})
    const cartData= await Cart.findOne({userId:userId})

    // console.log("addressData:--------------------",addressData)
    // console.log("amount:---------------",req.body.amount)
    // console.log('cartdata-----------',cartData.product);


  //   if (!cartData || cartData.products.length == 0) {
  //     // return res.status(400).json();
  //     console.log('hiiiiiii-------------------');
  // }
// console.log('hi herer-------------------');

  // console.log('userId-------------',req.session.userId);


  const orderData= new Order({
    userId:userId,
    products:cartData.product,
    address:addressData[0],
    paymentMethod:req.body.paymentMethod,
    totalAmount:req.body.amount,
})

const newOrder=  await orderData.save()

// console.log(('new order-========-----',newOrder));


    if(newOrder){
      console.log('hi-------------------------');

      const result = await Cart.updateOne(
          {userId:userId},
          {
            $unset: {
              product: 1,
            },
          }
        );
  }

  updateStock()

   // Update product quantities

  //  for (const item of cartData.products) {
  //   const product = await Product.findById(item.productId);
  //   product.quantity -= item.quantity;
  //   await product.save();
  //   }



async function updateStock() {
  for (const product of cartData.product) {
      const productInfo = await Product.findById(product.productId);

      if (productInfo) {
          // Update stock based on the quantity in the order
          productInfo.stock -= product.quantity;

          // Save the updated product info
          await productInfo.save();
      }
  }
}
  


  res.status(200).json({message:'success'})

    
  } catch (error) {
    console.log(error);
  }
}




const continueShop=async(req,res)=>{
  try {
    res.render('placeOrder')
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
    placeOrder,
    insertCheckoutAddress,
    deleteCheckoutAddress,
    continueShop
  }