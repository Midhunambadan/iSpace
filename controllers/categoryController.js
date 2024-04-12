const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");


// ==================================================================================================================
const loadcategoryList = async (req, res) => {
  try {
    const cateData= await Category.find().sort({listedDate:-1})
    // console.log(cateData)
    res.render('categoryPage',{category:cateData})
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const addcategory = async (req, res) => {
  try {
    const categoryData = await Category.find();

    if(categoryData.length>0){
        let checking=false
        for(let i=0;i<categoryData.length;i++){
            if(categoryData[i]['category'].toLowerCase()===req.body.category.toLowerCase()){
                checking=true
                break;
            }
        }
        if(checking==false){
            const category = new Category({
                category: req.body.category,
                description: req.body.description,
              });
          
              const cateData = await category.save();
              res.redirect("/admin/category?categoryAdd=true",);
              // res.status(200).send({success:true,message:"Category Data",data:cateData})

        }else{
          
            res.redirect("/admin/category?categoryExist=true");
        }

    }else{
    const category = new Category({
        category: req.body.category,
        description: req.body.description,
      });
  
      const cateData = await category.save();

      res.render("categoryPage",{category:cateData});
      // res.status(200).send({success:true,message:"Category Data",data:cateData})
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const loadeditCategory=async(req,res)=>{
  try {
    const id=req.query.id

    const cateData=await Category.findById({_id:id})
    
    if(cateData){
      res.render('editCategory',{category:cateData})
    }else{
      res.redirect('/admin/category')
    }

  } catch (error) {
    console.log(error.message);
  }
}

// ==================================================================================================================

const updateCategory=async(req,res)=>{
  try {
    
const categoryData = await Category.find();

    if(categoryData.length>0){
        let checking=false
        for(let i=0;i<categoryData.length;i++){
            if(categoryData[i]['category'].toLowerCase()===req.body.category.toLowerCase()){
                checking=true
                break;
            }
        }
        if(checking==false){
            const category = new Category({
                category: req.body.category,
                description: req.body.description,
              });
          
              const cateData=await Category.findByIdAndUpdate({_id:req.body.id},{$set:{category:req.body.category,description:req.body.description}})

              res.redirect("/admin/category?categoryAdd=true",);
        }else{
           
          
            res.redirect("/admin/category?categoryExist=true");
        }

    }else{
      const cateData=await Category.findByIdAndUpdate({_id:req.body.id},{$set:{category:req.body.category,description:req.body.description}})
      res.redirect('/admin/category')
    }
  } catch (error) {
    console.log(error.message);
  }
}

// ==================================================================================================================

const deleteCategory=async(req,res)=>{

  try {
    
    const id =req.query.id

   await Category.deleteOne({_id:id})

   res.redirect('/admin/category')

  } catch (error) {
    console.log(error.message);
  }
}



// ==================================================================================================================


// const ToggleblockCategories = async (req,res)=>{
//   try{
//       const catid= req.query.catid

//       console.log(catid);

//       const categories = await Category.findOne({_id:catid}); 

//       console.log('--------------------------------------',categories);

//       categories.isActive=!categories.isActive

//       await categories.save()

//       res.redirect('/admin/category');
//   } catch (error) {
//       console.error(error);
//   }
// }



const blockCategory=async (req,res)=>{
  try {
    
    const cateId=req.query.id
    console.log('====================================',cateId);

    const updateCategory = await Category.findByIdAndUpdate(cateId, { isActive: false });

    // await Product.find()
  res.redirect('/admin/category')

  } catch (error) {
    
  }
}




const unBlockCategory=async (req,res)=>{
  try {
    
    const cateId=req.query.id

    console.log('====================================',cateId);

    const updateCategory = await Category.findByIdAndUpdate(cateId, { isActive: true });
  res.redirect('/admin/category')

  } catch (error) {
    
  }
}





module.exports = {
  addcategory,
  loadcategoryList,
  loadeditCategory,
  updateCategory,
  deleteCategory,
  blockCategory,
  unBlockCategory
  // ToggleblockCategories
  

};
