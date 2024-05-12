
const Product = require('../models/productModel')
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const Category=require("../models/categoryModel")
const path = require('path');
const sharp = require('sharp');
const fs=require('fs')
const { v4: uuidv4 } = require('uuid');
const { json } = require('body-parser');
const mongoose=require('mongoose')


// ==================================================================================================================

const loadaddProduct = async (req, res) => {
    try {
      const cateData=await Category.find()
      console.log(cateData);
      res.render("addProduct",{category:cateData});
    } catch (error) {}
  };
  

// ---------------------------------------------------------------------------------------------------------------------------------
  const loadProduct = async (req, res) => {
    try {
      let limit=10

      let page=1
      if(req.query.page){
        page=req.query.page
      }

      // const productData=await Product.find()
      const productData = await Product.find().sort({ listedDate: -1 }).limit(limit*1).skip((page-1)*limit).exec();

      const count = await Product.find().sort({ listedDate: -1 }).countDocuments()
      // console.log(count,'uuuuuuuuuuuuuuuu');




      res.render("productPage",{
        products:productData,
        totalPages: Math.ceil(count/limit),
        currentPage:page
      
      })

    } catch (error) {
      console.log(error.message);
    }
  };
    
  // ==================================================================================================================
const insertProduct  =  async (req,res)=>{
  try {
    const productImg=req.productImg||[]

    const product_name=req.body.pname
    const discription=req.body.pdescription
    const MRP=req.body.mrp
    const category=req.body.category
    const discount=req.body.discount
    const stock=req.body.stock
    
    console.log('ddddddddddddddddddddddddddddddddd',category);

    const imageUrls = [];
    for (const file of req.files) {
       console.log(file)
        const filename = `${uuidv4()}.jpg`;
        
        await sharp(file.path)
            .resize({ width: 1000, height: 1000 })
            .toFile(`public/productImage/${filename}`);
        
        const imageUrl = `public/productImage/${filename}`; 
        imageUrls.push(filename);

        fs.unlink(file.path, (err) => {
            if (err) {
                console.error(`Error deleting file: ${err}`);
            } else {
                console.log(`File deleted: ${file.path}`);
            }
        });
    }

    const productData= new Product({
      product_name:product_name,
      discription:discription,
      MRP:MRP,
      productImages : imageUrls,
      categoryId:category,
      discount:discount,
      stock:stock
    
    })


    const products=await productData.save()
    

    // if(products){

    //   res.status(200).json({ success: true, message: 'Product added successfully' });


    // }else{

    //   res.send('not found')
    // }
    res.render('addProduct',{proData:products})

    
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: 'Failed to add product' });

  }
}

 // ==================================================================================================================




 const loadeditProduct=async(req,res)=>{
  try {
    const id=req.query.id
    const proData=await Product.findById({_id:id}).populate('categoryId')
    const cateData=await Category.find()

    req.session.editProductId = req.query.id;
    

    if(proData){
      // console.log(proData);
      res.render('editProduct',{products:proData,category:cateData})
    }else{
      res.send('inavalid')
    }

  } catch (error) {
    console.log(error.message);
  }
}


 // ==================================================================================================================


const updateProduct=async(req,res)=>{
  try {
    // const id=req.query.id
    const productId = req.session.editProductId ;
  

  const { pname, pdescription, mrp, category, discount, stock,productImages } = req.body;
// console.log("gfhg-vvvvvvvvvvvvvvv-------------",req.body)
// console.log("gfhg-vvvvvvvvvvvvvvv-------------",typeof(req.body.category))



const imageUrls = [];
for (const file of req.files) {
   console.log(file)
    const filename = `${uuidv4()}.jpg`;
    
    await sharp(file.path)
        .resize({ width: 1000, height: 1000 })
        .toFile(`public/productImage/${filename}`);
    
    const imageUrl = `public/productImage/${filename}`; 
    imageUrls.push(filename);

    fs.unlink(file.path, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            console.log(`File deleted: ${file.path}`);
        }
    });
}


  const proData=await Product.findByIdAndUpdate({_id:productId},
    {$set:
      {
      product_name:pname,
      discription:pdescription,
      MRP:mrp,
      categoryId: new mongoose.Types.ObjectId(category),
      discount:discount,
      stock:stock,
      // productImages : req.files.map(file => file.filename),

      productImages:imageUrls
      }
  })
  

    res.redirect('/admin/products')

// if (proData ) {
//   res.status(200).json({ message: 'Product updated successfully' });
// } else {
//   res.status(500).json({ message: 'Something went wrong' });
// }


  } catch (error) {
    console.log(error.message);
  }
}


 // ==================================================================================================================

const deleteProduct=async(req,res)=>{
  try{
    const id=req.query.id
    console.log(id);
    await Product.deleteOne({_id:id})

   
   res.redirect('/admin/products')

  }
  catch(error){
    console.log(error.message);
  }
}

 // ==================================================================================================================


 const blockProduct = async(req,res)=>{
  try {
    
    // const proId=req.query.id
    const proId = req.query.id;
    console.log('=============================================',proId);
    const updateProduct=await Product.findByIdAndUpdate(proId,{isActive:false})
    // const updateCategory = await Category.findByIdAndUpdate(cateId, { isActive: true });
    res.redirect('/admin/products')

  } catch (error) {
    
  }
 }

 
 const UnBlockProduct=async(req,res)=>{
  try {

    console.log('----------------------------------------idddddddddddgot');
    const proId=req.query.id
    
    console.log('----------------------------------------------',proId);
    const updateCategory=await Product.findByIdAndUpdate(proId,{isActive:true})
    res.redirect('/admin/products')

  } catch (error) {
    
  }
 }




 


module.exports={
    loadProduct,
    loadaddProduct,
    insertProduct,
    loadeditProduct,
    updateProduct,
    deleteProduct,
    blockProduct,
    UnBlockProduct,

    
}