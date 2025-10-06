const Order=require('../../models/orderModel')
const Cart=require('../../models/cartModel')
const Product=require('../../models/productModel')
const User=require('../../models/userModel')
const Address=require('../../models/addressModel')
const Wallet=require('../../models/walletModel')

const Razorpay = require('razorpay');



// var instance = new Razorpay({
//   key_id:process.env.KEYID,
//   key_secret:process.env.KEYSECRET

// });



const placeOrder=async(req,res)=>{
    try {
  
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


    const orderData= new Order({
      userId:userId,
      products:cartData.product,
      address:addressData[0],
      paymentMethod:req.body.paymentMethod,
      totalAmount:req.body.amount,
      orderId:newOrderId
  })
  
  const newOrder=  await orderData.save()
  
  
  
      if(newOrder){
  
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


  const paymentRazorpay = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const addressData = await Address.find({_id: req.body.selectedAddress});
        const cartData = await Cart.findOne({userId: userId});

        const generateOrderId = () => {
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

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "order_rcptid_11"
        };

        instance.orders.create(options, async (err, razOrder) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to create Razorpay order" });
                return;
            }

            const orderData = new Order({
                userId: userId,
                products: cartData.product,
                address: addressData[0],
                paymentMethod: req.body.paymentMethod,
                paymentStatus: 'Pending',  // Set to pending initially
                totalAmount: req.body.amount,
                orderId: newOrderId,
                razOrderId: razOrder.id
            });

            req.session.orderedProductData = cartData.product;

         const newOrder=  await orderData.save();



            res.status(200).json({ message: "Order created successfully", razOrder, orderId: newOrderId });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}






const paymentByWallet=async(req,res)=>{
  try {

    const userId=req.session.user_id

    let id = req.query.id
    req.session.buyNowProductId = id 

    console.log('idddddddddddddddddddddddddddddddddddddd',id)
    

    const addressData = await Address.find({_id: req.body.selectedAddress});
    const cartData = await Cart.findOne({userId: userId});

    console.log('addressData-----------------',addressData)
    console.log('cartData--------===========',cartData);

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

     console.log('newOrderId----------------------',newOrderId)


    if (req.body.paymentMethod === "Wallet") {
      paymentStatus = "Received";
      console.log('paymentStatus----------------------',paymentStatus);

       // Update the wallet balance and history
       const wallet=await Wallet.findOne({userId:userId})
       if (wallet && wallet.balance >= req.body.amount) {
        wallet.balance -= req.body.amount;
        wallet.transactionHistory.push({
               amount: req.body.amount,
               type: 'Debit'
           });
          const wallData= await wallet.save();
          console.log(wallData)
       } else {
           return res.json({ message: "Insufficient wallet balance" });
       }



       const orderData= new Order({
        userId:userId,
        products:cartData.product,
        address:addressData[0],
        paymentStatus : "Recieved",
        paymentMethod:req.body.paymentMethod,
        totalAmount:req.body.amount,
        orderId:newOrderId
    })
    
    const newOrder=  await orderData.save()

    console.log('newOrder-----------',newOrder)
    
    

    if(newOrder){
  
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

res.status(200).json({ message: 'success' });






    }
    
  } catch (error) {
    
  }
}




  const saveOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const userId = req.session.user_id;

        const cart = await Cart.findOne({ userId });

        let productDataToSave = cart.product;
        console.log('productDataToSave============================================',productDataToSave);

        if (!Array.isArray(productDataToSave)) {
            productDataToSave = [productDataToSave]; // Convert to array if it's not already
        }

        // Loop through each product in productDataToSave
        for (const item of productDataToSave) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Update stock of the product
                product.stock -= item.quantity;
                await product.save();
            }
        }


       

        const order = await Order.findOneAndUpdate(
            { orderId },
            { $set: { paymentStatus: "Received" } }, 
            { new: true } 
        );


        if(order){
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

        if (order) {
            console.log("Order payment status updated successfully");
            res.status(200).json({ message: "Order payment status updated successfully" });
        } else {
            console.log("Failed to update order payment status");
            res.status(404).send("Order not found");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};






  const loadInvoice=async(req,res)=>{
    try {

      const orderId=req.query.id
      // console.log('herrrrrrrrrrrrrrrrrrrrrrrre',orderId);

     

      const order=await Order.findById(orderId).populate('userId').populate('products.productId')
      // console.log('order----------------',order);

      res.render('invoice',{order})

    } catch (error) {
      
    }
  }

  

  





  
  module.exports={
    continueShop,
    placeOrder,
    paymentRazorpay,
    paymentByWallet,
    saveOrder,
    loadInvoice

  }