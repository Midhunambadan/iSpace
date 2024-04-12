 const Cart=require('../models/cartModel')
 const Product=require('../models/productModel')
 const User=require('../models/userModel')


 // userCart

const loadUserCart = async (req, res) => {
    try {

      const userId=req.session.user_id

      const loginData = await User.findById(userId)

      // console.log(loginData);
     const Data= await Cart.findOne({userId:userId}).populate('userId').populate('product.productId')

      res.render("userCart",{cartData:Data});

    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  // ==================================================================================================================

  const addToCart=async(req,res)=>{
    try {
      const{productId,quantity}=req.body
      const userId= req.session.user_id


      // console.log('jgyg==============',productId,quantity);
      // console.log('jjjjjjjjjjjjjjffffffff',userId);

      let productData = await Product.findOne({_id:productId})
            
            // console.log("Product Data :",productData)

            if(quantity <= productData.stock) {

            
                    let userCart= await Cart.findOne({userId})
                    if(!userCart){
                        userCart= new Cart({
                            userId:userId,
                            product:[]
                        })
                    }
 
                    const existingProduct = userCart.product.find(product => product.productId == productId);

                    console.log("exising product")
                    console.log(existingProduct)

                if (existingProduct) {
                    
                    existingProduct.stock += quantity;
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

  const updateCart=async(req,res)=>{
    try {
      

    } catch (error) {
      console.log(error);
    }
  }

  





  
const userCheckout=async(req,res)=>{
  try {

    const total=req.body.grandTotalValue
    console.log('----------------total',total);

    res.render('checkOut')
  } catch (error) {
    
  }
}




  
  module.exports={
    loadUserCart,
    addToCart,
    deleteCart,
    userCheckout,
    updateQuantity,
    updateCart
  }