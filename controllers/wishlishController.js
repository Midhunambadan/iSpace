
const Wishlist=require('../models/wishlistModel')
const Product=require('../models/productModel')



//userWishlist

const loaduserWishlist = async (req, res) => {
    try {
  
      const userId=req.session.user_id
      let wishList = await Wishlist.findOne({ userId }).populate('products.productId');
  
      res.render("userWishlist",{wishlist:wishList});
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  

  const addToWishlist = async (req, res) => {
    try {
      const proId = req.body.id; // Assuming the product ID is sent in the request body
      const product = await Product.findById(proId);
  
      const userId = req.session.user_id;
  
      let wishList = await Wishlist.findOne({ userId });

    //   console.log('--------------------------hi here',userId,wishList,proId);

  
      if (!wishList) {
        wishList = new Wishlist({
          userId,
          products: [{ productId: proId }]
        });
      } else {
        if (!wishList.products.some(item => item.productId.equals(proId))) {
          wishList.products.push({ productId: proId });
        }
      }
  
      await wishList.save();
    //   console.log('Wishlist updated:', wishList);

    // res.status(200).json({message:'Wishlist updated'})

    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  









  
//   const addToWishlist = async (req, res) => {
//     try {

        
//       const proId = req.query.id;
//       const product = await Product.findById(proId);
//       console.log('product-----------',product);
  
//       const userId = req.session.user_id;

//       console.log('proId------------',proId);
//       console.log('userId----------',userId);
  
//       let wishList = await Wishlist.findOne({ userId });

//       console.log('wishlish----------',wishList);
  
//       if (!wishList) {
//         wishList = new Wishlist({
//           userId,
//           products: [{ productId: proId }]
//         });
//       } else {
//         if (!wishList.products.some(item => item.productId.equals(proId))) {
//           wishList.products.push({ productId: proId });
//         }
//       }
  
//       await wishList.save();
//       console.log('Wishlist updated:', wishList);
//       res.send('Wishlist updated');
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
  
  
  // ==================================================================================================================


const deleteWishlist=async(req,res)=>{
    try {
        const  productId  = req.query.id;
        const userId = req.session.user_id;
  
        const userWishlistData = await Wishlist.find({ userId: userId })
  
        // console.log('=============================================productId',req.query.id);
       const wishlistData= await Wishlist.updateOne(
            { userId:userId },
            { $pull: { products: { productId:productId } } }
        );
        
  
        // console.log('====================================Cartdata',cartData);
  
        res.redirect('/wishlist');
    } catch (error) {
        
    }
}







  

  module.exports={
    addToWishlist,
    loaduserWishlist,
    deleteWishlist

  }