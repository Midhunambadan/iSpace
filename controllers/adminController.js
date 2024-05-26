const { render } = require("../app");
const Admin = require("../models/adminModel");
const { findByIdAndUpdate } = require("../models/categoryModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product=require('../models/productModel')
const Order=require('../models/orderModel')

const cron = require('node-cron');
const bcrypt = require("bcrypt");
const randomstring=require('randomstring')
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
    const orders=await Order.find({ paymentStatus: 'Recieved',
    orderStatus: 'Delivered',}).countDocuments()
    const product=await Product.find().countDocuments()
    const category=await Category.find().countDocuments()
    const products=await Product.find()

    const totalOrder = await Order.find({
      paymentStatus: 'Recieved',
      orderStatus: 'Delivered',
  }).populate('userId');

  const totalSum = totalOrder.reduce((sum, order) => {
      sum= sum+parseInt(order.totalAmount)
      return sum
  },0);


  const order = await Order.find({ 
    paymentStatus: 'Recieved',
    orderStatus: 'Delivered'});


  const orderCountsByMonth = Array.from({ length: 12 }, () => 0);

  order.forEach(order => {
    const monthIndex = order.orderDate.getMonth();
    orderCountsByMonth[monthIndex]++;
});

console.log('----------------orderCountsByMonth',orderCountsByMonth);

const productCountsByMonth = Array.from({ length: 12 }, () => 0);
products.forEach(product => {
    const monthIndex = product.listedDate.getMonth();
    productCountsByMonth[monthIndex]++;
});
const orderCountsByYearData = await Order.aggregate([
    {
        $group: {
            _id: { $year: "$orderDate" },
            orderCount: { $sum: 1 }
        }
    },
    {
        $sort: { "_id": 1 }
    }
]);

console.log('---------------productCountsByMonth',productCountsByMonth);


const orderCountsByYear = [];
let currentYearIndex = 0;
const currentYear = new Date().getFullYear();

for (let i = 0; i < orderCountsByYearData.length; i++) {
    const year = orderCountsByYearData[i]._id;
    const orderCount = orderCountsByYearData[i].orderCount;

    while (currentYear - 5 + currentYearIndex < year) {
        orderCountsByYear.push(0);
        currentYearIndex++;
    }

    orderCountsByYear.push(orderCount);
    currentYearIndex++;
}

while (currentYear - 5 + currentYearIndex <= currentYear + 6) {
    orderCountsByYear.push(0);
    currentYearIndex++;
}

console.log('--------------orderCountsByYear',orderCountsByYear);

const productCountsByYearData = await Product.aggregate([
    {
        $group: {
            _id: { $year: "$listedDate" },
            productCount: { $sum: 1 }
        }
    },
    {
        $sort: { "_id": 1 }
    }
]);
const productCountsByYear = [];
let currentYearIndex1 = 0;
const currentYear1 = new Date().getFullYear();

for (let i = 0; i < productCountsByYearData.length; i++) {
    const year = productCountsByYearData[i]._id;
    const productCount = productCountsByYearData[i].productCount;

    while (currentYear1 - 5 + currentYearIndex1 < year) {
        productCountsByYear.push(0);
        currentYearIndex1++;
    }

    productCountsByYear.push(productCount);
    currentYearIndex1++;
}

while (currentYear1 - 5 + currentYearIndex1 <= currentYear1 + 6) {
    productCountsByYear.push(0);
    currentYearIndex1++;
}

console.log('----------------productCountsByYear',productCountsByYear)

const totalAmountByYearData = await Order.aggregate([
    {
        $group: {
            _id: { $year: "$orderDate" },
            totalAmount: { $sum: { $toDouble: "$totalAmount" } }
        }
    },
    {
        $sort: { "_id": 1 }
    }
]);

const totalAmountByYear = [];
let currentYearIndex2 = 0;
const currentYear2 = new Date().getFullYear();

for (let i = 0; i < totalAmountByYearData.length; i++) {
    const year = totalAmountByYearData[i]._id;
    const totalAmount = totalAmountByYearData[i].totalAmount;

    while (currentYear2 - 5 + currentYearIndex2 < year) {
        totalAmountByYear.push(0);
        currentYearIndex2++;
    }

    totalAmountByYear.push(totalAmount);
    currentYearIndex2++;
}

while (currentYear2 - 5 + currentYearIndex2 <= currentYear2 + 6) {
    totalAmountByYear.push(0);
    currentYearIndex2++;
}


console.log('---------------totalAmountByYear',totalAmountByYear);




const totalAmountByMonth = [];
let currentMonthIndex = 0;
const currentYear123 = new Date().getFullYear();

for (let i = 0; i < 12; i++) {
    totalAmountByMonth.push(0);
}

order.forEach(order => {
    const monthIndex = order.orderDate.getMonth();
    const totalAmount = parseFloat(order.totalAmount);

    totalAmountByMonth[monthIndex] += totalAmount;
});

for (let i = 0; i < 12; i++) {
    if (totalAmountByMonth[i] === 0) {
        totalAmountByMonth[i] = 0;
    }
}

console.log('--------------totalAmountByMonth',totalAmountByMonth)











  const bestSellingProduct = await Order.aggregate([
    {
        $unwind: "$products"
    },
    {
        $group: {
            _id: "$products.productId",
            totalSales: { $sum: "$products.quantity" }
        }
    },
    {
        $sort: { totalSales: -1 }
    },
    {
        $limit: 10
    },
    {
        $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product"
        }
    },
    {
        $unwind: "$product"
    },
    {
        $project: {
            productName: "$product.product_name",
            totalSales: 1
        }
    }
]);

// console.log('............------------------.....bestSellingProduct',bestSellingProduct)


const bestSellingCategories = await Order.aggregate([
  {
      $unwind: "$products"
  },
  {
      $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productInfo"
      }
  },
  {
      $unwind: "$productInfo"
  },
  {
      $lookup: {
          from: "categories",
          localField: "productInfo.categoryId",
          foreignField: "_id",
          as: "category"
      }
  },
  {
      $unwind: "$category"
  },
  {
      $group: {
          _id: "$category._id",
          name: { $first: "$category.category" },
          totalSales: { $sum: "$products.quantity" }
      }
  },
  {
      $sort: { totalSales: -1 }
  },
  {
      $limit: 10
  }
]);


// console.log('------------------------bestSellingCategories',bestSellingCategories);
    // console.log(orders,'==========',product)

    
    

    res.render("home",
    {
      orders,
      product,
      category,
      totalSum,
      bestSellingProduct,
      bestSellingCategories,

      orderCountsByMonth,
      productCountsByMonth, 
      orderCountsByYear, 
      productCountsByYear, 
      totalAmountByMonth,
      totalAmountByYear

    });

  } catch (error) {
    console.log(error.message);
  }
};

// ==================================================================================================================


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
    const usersData = await User.find().sort({registerDate:-1})

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
  unblockUser,

  // toggleBlockAndUnBolock
};
