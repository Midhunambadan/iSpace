const Order=require('../models/orderModel')
const Cart=require('../models/cartModel')
const Product=require('../models/productModel')
const User=require('../models/userModel')
const Address=require('../models/addressModel')

const Razorpay = require('razorpay');



var instance = new Razorpay({
  key_id:process.env.KEYID,
  key_secret:process.env.KEYSECRET

});

// console.log(instance,"a,badan odi")





const placeOrder=async(req,res)=>{
    try {
  
      // console.log('placeorder -------------------');
  

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


    function generateOrderId() {
      const timestamp = Date.now().toString(); 
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
      let orderId = 'ORD'; 
      
     
      while (orderId.length < 6) {
          const randomIndex = Math.floor(Math.random() * randomChars.length);
          orderId += randomChars.charAt(randomIndex);
      }
      
      return orderId + timestamp.slice(-6); 
      }
  
     const newOrderId = generateOrderId();


    const orderData= new Order({
      userId:userId,
      products:cartData.product,
      address:addressData[0],
      paymentMethod:req.body.paymentMethod,
      totalAmount:req.body.amount,
      orderId:newOrderId
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




  const paymentRazorpay=async(req,res)=>{
    try {
      console.log("starting razor")
      const userId=req.session.user_id
      const addressData= await Address.find({_id:req.body.selectedAddress})
      const cartData= await Cart.findOne({userId:userId})



    function generateOrderId() {
      const timestamp = Date.now().toString(); 
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
      let orderId = 'ORD'; 
      
     
      while (orderId.length < 6) {
          const randomIndex = Math.floor(Math.random() * randomChars.length);
          orderId += randomChars.charAt(randomIndex);
      }
      
      return orderId + timestamp.slice(-6); 
      }
  
     const newOrderId = generateOrderId();


        var options = {
          amount: req.body.amount*100,  // amount in the smallest currency unit
          
          currency: "INR",
          receipt: "order_rcptid_11"
        };

        instance.orders.create(options,async function(err, razOrder) {
        
          console.log(options.amount,"asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")




          
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to create Razorpay order" });
            return;
          }
          console.log(razOrder);

        const orderData= new Order({
          userId:userId,
          products:cartData.product,
          address:addressData[0],
          paymentMethod:req.body.paymentMethod,
          paymentStatus:'Recieved',
          totalAmount:req.body.amount,
          orderId:newOrderId,
          razOrderId:razOrder.id
      })

      console.log(orderData);

      req.session.orderedProductData=cartData.product

      const newOrder=  await orderData.save()


      console.log(newOrder);


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
  
    // updateStock()
  
   
  
  // async function updateStock() {
  //   for (const product of cartData.product) {
  //       const productInfo = await Product.findById(product.productId);
  
  //       if (productInfo) {
  //           // Update stock based on the quantity in the order
  //           productInfo.stock -= product.quantity;
  
  //           // Save the updated product info
  //           await productInfo.save();
  //       }
  //   }
  // }
    // res.status(200).json({message:'success'})
    console.log("last")
    res.status(200).json({ message: "Order placed successfully", razOrder});

  
        }); 
    } catch (error) {
      
      
    }
  }

  

  

  





  
  module.exports={
    continueShop,
    placeOrder,
    paymentRazorpay

  }