const { render } = require("../app");
const Admin = require("../models/adminModel");
const { findByIdAndUpdate } = require("../models/categoryModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const randomstring=require('randomstring')
const Category = require("../models/categoryModel");


// // ==================================================================================================================


const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const loadAdminform = async (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log("hai");
    console.log(error.message);
  }
};

// ==================================================================================================================

// no need to verify signup
const verifySignup = async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;
    const spassword = await securePassword(password);
    // console.log(spassword)
    // console.log(req.body);
    const adminData = new Admin({
      name: username,
      email: email,
      mobile: mobile,
      password: spassword,
    });

    const admin = await adminData.save();
    console.log(admin);
    if (admin) {
      res.render("adminLogin", {
        message: "You registration has been sucessfull.Please Login!",
      });
    } else {
      res.render("adminLogin", {
        message: "Enter correct details",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const verifyLogin = async (req, res) => {
  try {
   
    const email = req.body.email;
    const password = req.body.password;

    const adminData = await Admin.findOne({ email: email});

    if (adminData) {
      // console.log(adminData);
      const matchPassword = await bcrypt.compare(password, adminData.password);

      if (matchPassword) {
        if (adminData.is_admin === false) {
          res.render("adminLogin");
        } else {
          req.session.admin_id = adminData._id;
          res.redirect("/admin/home");
          // res.render('home')
        }
      } else {
        res.render("adminLogin", {
          message: "Username and password incorrect",
        });
      }
    } else {
      res.render("adminLogin", { message: "Username and password incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const loadAdminDashboard = async (req, res) => {
  try {
    res.render("home");
  } catch (error) {
    console.log(error.message);
  }
};

const adminLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const userList = async (req, res) => {
  try {
    const usersData = await User.find().sort({registerDate:-1});

    res.render("userList", { users: usersData });
  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================

const loadAddUser=async(req,res)=>{

  try {
    res.render('adminAdduser')
  } catch (error) {
    console.log(error.message);
  }
}

const addUser=async(req,res)=>{
  try {
    
    const name=req.body.name
    const mobile=req.body.mobile
    const email=req.body.email
    const password=req.body.password

    const spassword=await securePassword(password)
    const user= new User({
      name:name,
      mobile:mobile,
      email:email,
      password:spassword
    })
    const userData=await user.save()


    if(userData){
      // console.log(userData);
      res.redirect('/admin/userlist')
    }else{
      res,render('adminAdduser')
    }


  } catch (error) {
    console.log(error.message);
  }
}

// ==================================================================================================================

const blockUser = async (req, res) => {
  try {
    // console.log("userId got===========================");

    const userId = req.query.id;
    // console.log(userId, "userId got===========================");

    const updateUser = await User.findByIdAndUpdate(userId, { isActive: false });
    res.redirect('/admin/home')

    if (!updateUser) {
      return res.status(404).send('User not found');
    }

    console.log(updateUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
};

// ==================================================================================================================

const unblockUser = async (req, res) => {
  try {
    // console.log("userId got==================================");

    const userId = req.query.id;
    // console.log(userId, "userId got==================================");

    const updateUser = await User.findByIdAndUpdate(userId, { isActive: true });
    res.redirect('/admin/home')

    if (!updateUser) {
      return res.status(404).send('User not found');
    }

    console.log(updateUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
};

// ==================================================================================================================
 












module.exports = {
  loadAdminform,
  verifyLogin,
  verifySignup,
  loadAdminDashboard,
  adminLogout,
  userList,
  loadAddUser,
  addUser,
  blockUser,
  unblockUser
};
