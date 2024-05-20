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

            req.session.cateId=cateId
            
         
            const productsToUpdate = await Product.find({ categoryId: cateId });
            
            if (!productsToUpdate) {
              return res.status(404).json({ message: 'product not found' });
            }

            
            for (const product of productsToUpdate) {
                const updatedPrice = Math.round(product.MRP * ((100 - offerPercentage) / 100));
                product.MRP = updatedPrice;

                await product.save();

               }

            //    res.status(200).json({ success: true, message: 'Offer applied successfully' });

               res.status(200).json({success:true, message: 'Offer applied successfully', category: updatedCategory });

            
          res.redirect('/admin/offer-page')
        
    }

        
    } catch (error) {
        // res.status(500).json({ success: false, message: 'Failed to apply offer' });

    }
}


const removeCategoryOffer = async (req, res) => {
    try {
        const id = req.query.id;

        // Find the category
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Get the offer percentage from the category
        const offerPercentage = category.offer.offerPercentage;

        // Find all products in this category
        const productsToUpdate = await Product.find({ categoryId: id });
        if (!productsToUpdate || productsToUpdate.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for this category' });
        }

        // Update each product's price back to its normal price
        for (const product of productsToUpdate) {
            const originalPrice = Math.round(product.MRP / ((100 - offerPercentage) / 100));
            product.MRP = originalPrice;
            await product.save();
        }

        // Remove the offer from the category
        category.offer = undefined;
        await category.save();

        res.status(200).json({ success: true, message: 'Offer removed and prices updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to remove offer' });
    }
};


//-------------------product offer controllers---------------------------

const loadProductOffer=async(req,res)=>{
    try {

        const productData=await Product.find({isActive:true})
        res.render('productOffer',{products:productData})
    } catch (error) {
        
    }
}


const addProductOffer=async(req,res)=>{
    try {
        
        // console.log('produdtcoff------------------------');

        // const proData=await Product.find({isActive:true})
        const {name,offerPercentage,product,validity}=req.body
      
        console.log('req.body------------------------',req.body);

      
        const existingProduct = await Product.findOne({ product_name: product });

        // console.log('existingProduct------------------------',existingProduct);

        if (existingProduct) {
            existingProduct.productOffer = {
                name: name,
                offerPercentage: offerPercentage,
                validity: validity
            };

            // Save the updated category
            const updatedProduct = await existingProduct.save();
            const proId=updatedProduct._id

            req.session.proId=proId
            
            console.log('updatedProduct------------------------',updatedProduct);

           


            const updatedPrice = Math.round(existingProduct.MRP * ((100 - offerPercentage) / 100));
            existingProduct.MRP = updatedPrice;
          const newProduct=  await existingProduct.save();



            //    console.log('newProduct-------=============-----------------',newProduct);


               res.status(200).json({success:true, message: 'Product Offer applied successfully', products: newProduct });

            
          res.redirect('/admin/product-offer')
        
    }

    } catch (error) {
        
    }
}



const removeProductOffer=async(req,res)=>{
    try {
        const id = req.query.id;
        const product = await Product.findById(id);
        const offerPercentage = product.productOffer.offerPercentage;

        // Find all products in this category
        const productsToUpdate = await Product.find({ _id: id });
        
       

        // Update each product's price back to its normal price
        for (const product of productsToUpdate) {
            const originalPrice = Math.round(product.MRP / ((100 - offerPercentage) / 100));
            product.MRP = originalPrice;
            await product.save();
        }



        // Remove the offer from the category
        product.productOffer = undefined;
        await product.save();

        res.status(200).json({ success: true, message: 'Offer removed and prices updated successfully' });
    } catch (error) {
        
    }
}









module.exports={
    loadOfferPage,
    addCategoroyOffer,
    removeCategoryOffer,

    loadProductOffer,
    addProductOffer,
    removeProductOffer
}