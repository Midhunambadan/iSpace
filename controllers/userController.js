const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring=require('randomstring')
const otpGenerator = require("otp-generator");
const Admin = require("../models/adminModel");
const Product=require('../models/productModel')
const Category=require('../models/categoryModel')
const Address=require('../models/addressModel')


// ==================================================================================================================

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

//loadHome

const loaduserHome = async (req, res) => {
  try {

    const userId=req.session.user_id

    const userData = await User.find({ _id:userId});
    const productData = await Product.find({isActive:true}).populate({
      path: 'categoryId',
      match: { isActive: true }
    })
    
    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
  });
  
  
    const cateData = await Category.find({ isActive: true });


// console.log('kffffffffffffffffffff',userData);
    res.render('userHome', { products:filteredProductData, category: cateData,users:userData });

  } catch (error) {
    console.log(error);
  }
};




// const loaduserHome = async (req, res) => {
//   try {
    
//     const userData=await User.find({isActive:true})
//     console.log(userData);
//     const productData=await Product.find({isActive:true})
//     const cateData=await Category.find({isActive:true})
//     console.log(cateData)

    
//     res.render("userHome",{products:productData,category:cateData});
    

//   } catch (error) {
//     console.log(error);
//   }
// };


// ==================================================================================================================

// user LoadReg

const loaduserRegister = async (req, res) => {
  try {
    res.render("signup");
  } catch (error) {}
};


// ==================================================================================================================

// user insert

const  verifySignup = async (req, res,next) => {
  try {
    
  
    const userExist=await User.findOne({email:req.body.email})
    const mobileExist=await User.findOne({mobile:req.body.mobile})
    console.log('lll====================================',mobileExist);

    if(userExist){
      // res.redirect('/')
      res.render('login',{message:'Email already exist! Please choose another email'})
    }

    if(mobileExist){
      res.render('login',{message:'mobile already exist! Please choose another mobile'})

    }

    const { username, email, mobile,password,password2 } = req.body;

    const spassword = await securePassword(password);

    const userData = new User({
      name: username,
      email: email,
      mobile: mobile,
      password: spassword,
      password2:password2
    });
    const user =  userData;//New save (25-03-24)

    req.session.user1 = user;


next()
    
    // }
  } catch (error) {
    console.log(error);
  }
};

// ==================================================================================================================

// otp start

const getOtp = async (req, res) => {
  // console.log("get oto-------------------------------------------- ")
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USEREMAIL,
        pass: process.env.USERPASS,
      },
    });

    const { email } = req.session.user1;

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    // console.log("otp----------",otp);

    req.session.otp = otp;

    // Email content
    const mailOptions = {
      from: process.env.USEREMAIL,
      to: email,
      subject: "Your OTP for verification",
      text: `Your OTP is ${otp}`,
    };

    console.log("otp----------",+otp);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

        res.render("otp-form",{message:'OTP send Your mail.Please verify OTP!!'});

        
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const verifyOtp = async (req, res) => {
  try {
    if (req.session.otp == req.body.otp) {
      const { email, name, mobile,password} = req.session.user1;

      const user = new User({
        name: name,
        email: email,
        mobile: mobile,
        password: password,
      });


      const userData = await user.save();

      if (userData) {
        req.session.user1 = userData._id;
        res.redirect('/home')
        // res.render('userHome')
      }
    } else {
      res.render("otp-form", { message: "Please Enter correct OTP !!!" });
    }
  } catch (error) {
    console.log(error);
  }
};


//otp end

// ==================================================================================================================

// loadUserLogin

const loaduserLogin = async (req, res) => {
  try {
    res.render("login",{message:'Please Login!!!'});
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================
// verifyLogin

const verifyLogin = async (req,res) => {
  try {
    const email = req.body.loginemail;
    const pass = req.body.loginpassword;

    const userData = await User.findOne({ email: email});   //this password i have doubt

    // isActive :true

    // console.log(userData)
    // const passa= await bcrypt.compare(pass,userData.password)
    // console.log('--------------------',passa);
    // console.log('--------------------',pass);
    // console.log('----------------------------',userData.password);

    if(userData) {
     
      const matchPasswords =  await bcrypt.compare(pass, userData.password)
      
    // console.log('=====================',matchPasswords);

      if (matchPasswords) {
        if (userData.isActive == false) {
          console.log("midhun ambadan");
          res.render("login", { message: "Your accouct has been blocked! Please Contact customer care" });
        } else {
          console.log("akr");
          req.session.user_id = userData._id;
          res.redirect("/");
          // res.render('userHome')
        }
      } else {
        console.log("joel francis");
        res.render("login", { message: "Username or password is incorrect" });
      }

    } else {
      res.render("login", { message: "Username or password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

// userLogout

const userLogout = async(req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================


// ---------------Forgot password----------------------------


const loadForgotPassword=async(req,res)=>{
  try {

    
    res.render('forgotPage')
    
  } catch (error) {
    console.log(error.message);
  }
}

const getForgotOtp= async (req, res) => {
  try {
    const email = req.body.email;

    const userData = await User.findOne({ email: email });
    const user = req.session.userData;//this code no user

    req.session.userId=userData._id

    // console.log('----------------------userData_Id',req.session.userId);

    
    if (userData) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.USEREMAIL,
          pass: process.env.USERPASS,
        },
      });

      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      // Email content
      const mailOptions = {
        from: process.env.USEREMAIL,
        to: userData.email, // Use userData.email instead of req.session.userData.email
        subject: "Your OTP for verification",
        text: `Your OTP is ${otp}`,
      };

      req.session.otp = otp;

      console.log('otp--------------------',[otp]);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });

      res.render('forgotOtpPage', { message: 'OTP sent to email, please verify!' });
    } else {
      res.redirect('/forgot');
      // res.render('forgotOtpPage', { message: 'Invalid OTP.Please Enter correct OTP !' });

    }
  } catch (error) {
    console.error("Error in verifyForgotPassword:", error);
    res.status(500).send("Internal Server Error");
  }
}




const verifyForgotOtp=async(req,res)=>{
  try {
    
    if(req.session.otp==req.body.otp){
      res.render('passwordReset')
    }else{
      res.redirect('/forgot')
    }
   
  } catch (error) {
    console.log(error);
  }
}




const loadPasswordReset=async(req,res)=>{
  try {
    
const userId=req.session.userId
// const password=req.body.password

// console.log('---------------------------password',password);
const userData=await User.findById({_id:userId})
// console.log('-----------------------userdata',userData);

// const spassword = await securePassword(userData);

res.render('passwordReset',{user:userData,message:'Please enter new Password!'})

  } catch (error) {
    
  }
}



const VerifyPasswordReset=async(req,res)=>{
  try {
    const userId=req.session.userId


    const password = req.body.password
    // console.log('----------------password',password);
    const spassword=await securePassword(password)
    // console.log(spassword);

    const userData = await User.findByIdAndUpdate(userId, { password: spassword });

    // console.log('-----------------------VerifyPasswordReset',userId);
    res.render('passwordReset',{message:'Password successfully changed!'})
    
  } catch (error) {
    
  }
}

/---------------------------Forgot password code end------------------------------/


// userDashboard

const loaduserDashboard = async (req, res) => {
  try {
    
    const userId=req.session.user_id

    const userData = await User.findById({ _id: userId});
    const addressData=await Address.find({user:userId})



    console.log('--------------------addressData',addressData.name);

    res.render("userDashboard", { user: userData,address:addressData });
  } catch (error) {
    console.log(error.message);
  }
};


// ==================================================================================================================


//userWishlist

const loaduserWishlist = async (req, res) => {
  try {
    res.render("userWishlist");
  } catch (error) {
    console.log(error.message);
  }
};
// ==================================================================================================================

//show product

const showProduct=async(req,res)=>{

  try {
    const id=req.query.id
    const proData=await Product.find({_id:id}).populate('categoryId')

    // const productData = await Product.find({ isActive: true }).populate('categoryId');


    // console.log('product dataaaaaaaa',[proData]);
    res.render('showProduct',{products:proData})

  } catch (error) {
    console.log(error.message);
  }
}

// ==================================================================================================================



const loadAllProduct = async (req, res) => {
  try {


    
    const productData = await Product.find({ isActive: true }).populate({
      path: 'categoryId',
      match: { isActive: true }
    });

    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
    });

    res.render('showAllProduct', { products: filteredProductData });
  } catch (error) {
    console.log(error);
  }
};


//-------------------------sort start----------------------------------------------

const priceLowToHigh=async(req,res)=>{
  try {
    
    const productData = await Product.find({ isActive: true }).populate({
      path: 'categoryId',
      match: { isActive: true }
    }).sort({MRP:1});

    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
    });

    res.render('showAllProduct', { products: filteredProductData });

  } catch (error) {
    
  }
 }



const priceHighToLow=async(req,res)=>{
  try {
    
    const productData = await Product.find({ isActive: true }).populate({
      path: 'categoryId',
      match: { isActive: true }
    }).sort({MRP:-1});

    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
    });

    res.render('showAllProduct', { products: filteredProductData });

  } catch (error) {
    
  }
 }


 const sortAtoZ=async(req,res)=>{
  try {
    
    const productData = await Product.find({ isActive: true }).populate({
      path: 'categoryId',
      match: { isActive: true }
    }).sort({product_name:1});

    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
    });

    res.render('showAllProduct', { products: filteredProductData });

  } catch (error) {
    
  }
 }




 const sortZtoA=async(req,res)=>{
  try {
    
    const productData = await Product.find({ isActive: true }).populate({
      path: 'categoryId',
      match: { isActive: true }
    }).sort({product_name:-1});

    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
    });

    res.render('showAllProduct', { products: filteredProductData });

  } catch (error) {
    
  }
 }


 const newArrivals=async(req,res)=>{
  try {
    
    const productData = await Product.find({ isActive: true }).populate({
      path: 'categoryId',
      match: { isActive: true }
    }).sort({listedDate:-1});

    // Filter out products with null categoryId (inactive categories)
    const filteredProductData = productData.filter(product => {
      return product.categoryId && product.categoryId.isActive === true;
    });

    res.render('showAllProduct', { products: filteredProductData });

  } catch (error) {
    
  }
 }


 const loadChangePassword=async(req,res)=>{
  try {
    res.render('changePassword',{message:"Enter Your Current password and Reset!!!"})
    
    
  } catch (error) {
    
  }
 }



const verifyChangePassword=async(req,res)=>{
  try {
    const userId=req.session.user_id

    const password=req.body.currentPassword
    const newPassword=req.body.password

    const userData=await User.findById(userId)

    // console.log('----------userData',userData);

    const spassword=await securePassword(newPassword)

    const isMatch = await bcrypt.compare(password, userData.password);
    if (isMatch) {
    await User.findByIdAndUpdate(userId, { password: spassword });
    res.render('changePassword',{message:"Password changed successfully!"})
    } else {
      res.redirect('/change-password')
    }

    

    // console.log('password-------------',userData);
    // console.log('----------oldpassword',oldpassword);
  } catch (error) {
    console.log(error.message);
  }
}
 



module.exports = {
  loaduserHome,
  loaduserLogin,
  loaduserRegister,
  verifySignup,
  verifyLogin,
  userLogout,
  loadForgotPassword,
  getForgotOtp,
  verifyForgotOtp,
  loadPasswordReset,
  VerifyPasswordReset,
  loaduserDashboard,
  loaduserWishlist,
  getOtp,
  verifyOtp,
  showProduct,
  loadAllProduct,

  priceLowToHigh,
  priceHighToLow,
  sortAtoZ,
  sortZtoA,
  newArrivals,

  loadChangePassword,
  verifyChangePassword
 

};
