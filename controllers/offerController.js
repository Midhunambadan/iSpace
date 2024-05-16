const Category=require('../models/categoryModel')
const Product=require('../models/productModel')


const loadOfferPage=async(req,res)=>{
    try {

        const cateData=await Category.find({isActive:true})

        // console.log(cateData);
        res.render('offerPage',{cateData})
        
    } catch (error) {
        
    }
}


const addCategoroyOffer=async(req,res)=>{
    try {
        
        
        // const proData=await Product.find({isActive:true})
        const {name,offerPercentage,category,validity}=req.body
      

      
        const existingCategory = await Category.findOne({ category: category });

       
        if (existingCategory) {
            existingCategory.offer = {
                name: name,
                offerPercentage: offerPercentage,
                validity: validity
            };

            // Save the updated category
            const updatedCategory = await existingCategory.save();
            const cateId=updatedCategory._id
            
         
            const productsToUpdate = await Product.find({ categoryId: cateId });
            
            if (!productsToUpdate) {
              return res.status(404).json({ message: 'product not found' });
            }

            
            for (const product of productsToUpdate) {
                const updatedPrice = Math.round(product.MRP * ((100 - offerPercentage) / 100));
                product.MRP = updatedPrice;
                // console.log(updatedPrice,"++++++++++++++++ssadhgsadhsadghdsghasdghhdashsadhashhgasdhhgasdhgasdghgasghaahdhgadhj")
                await product.save();

               }

            //    res.status(200).json({ success: true, message: 'Offer applied successfully' });

               res.status(200).json({ message: 'Offer applied successfully', category: updatedCategory });

            
          res.redirect('/admin/offer-page')
        
    }

        
    } catch (error) {
        // res.status(500).json({ success: false, message: 'Failed to apply offer' });

    }
}




const removeCategoryOffer=async(req,res)=>{
    try {
        const id =req.query.id

        await Category.updateOne({ _id: id }, { $unset: { offer: 1 } });

        // console.log('remove offer controler',category);
        res.redirect('/admin/offer-page')
    } catch (error) {
        
    }
}







module.exports={
    loadOfferPage,
    addCategoroyOffer,
    removeCategoryOffer
}