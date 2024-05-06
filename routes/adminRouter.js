const express = require("express");
const admin_router = express();

const path=require('path')

const adminController = require("../controllers/adminController");
const categoryController=require("../controllers/categoryController")
const userController=require('../controllers/userController')
const productController=require('../controllers/productController')
const adminOrderController=require('../controllers/adminOrderController')

const config = require("../config/config");
const session = require("express-session");
const multer=require('multer')

admin_router.use(session({
  secret:config.sessionSecret,
  resave:false,
  saveUninitialized:true
}))

// admin_router.use(session({ secret: config.sessionSecret }));
const adminAuth = require("../middleware/adminAuth");
const { default: mongoose } = require("mongoose");





admin_router.use(express.json())
admin_router.use(express.urlencoded({extended: true}));
admin_router.set("view engine", "ejs");
admin_router.set("views", "./views/admin");

// <<<<<<<<<<<<<<<<<<<<<<<Upload Product>>>>>>>>>>

const storage= multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,path.join(__dirname,'../public/productImage'))
  },
  filename:function(req,file,cb){
    const name=Date.now()+'-'+file.originalname;
    cb(null,name)
  }
})
 
const upload=multer({storage:storage});

// <<<<<<<<<<<<<<<<<<<<<For Admin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

admin_router.get("/", adminAuth.isLogout, adminController.loadAdminform);
admin_router.post("/verifySignup", adminController.verifySignup);
admin_router.post("/verifyLogin", adminController.verifyLogin);
admin_router.get("/home",adminAuth.isLogin,adminController.loadAdminDashboard);
admin_router.get("/logout", adminAuth.isLogin, adminController.adminLogout);
admin_router.get("/userlist", adminAuth.isLogin, adminController.userList);

// <<<<<<<<<<<<<<<<<<<<<For Category>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


admin_router.get('/category',adminAuth.isLogin,categoryController.loadcategoryList)
admin_router.post('/category',adminAuth.isLogin,categoryController.addcategory)
admin_router.get('/category-edit',adminAuth.isLogin,categoryController.loadeditCategory)
admin_router.post('/category-edit',adminAuth.isLogin,categoryController.updateCategory)
admin_router.get('/delete-category',adminAuth.isLogin,categoryController.deleteCategory)

admin_router.get('/category-block',adminAuth.isLogin,categoryController.blockCategory)
admin_router.get('/category-unblock',adminAuth.isLogin,categoryController.unBlockCategory)



// <<<<<<<<<<<<<<<<<<<<<For User>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

admin_router.get('/adduser',adminAuth.isLogin,adminController.loadAddUser)
admin_router.post('/adduser',adminAuth.isLogin,adminController.addUser)
admin_router.get('/block-user',adminAuth.isLogin,adminController.blockUser)
admin_router.get('/unblock-user',adminAuth.isLogin,adminController.unblockUser)



// <<<<<<<<<<<<<<<<<<<<<For Products>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
admin_router.get("/products",adminAuth.isLogin, productController.loadProduct);
admin_router.get('/add-product',adminAuth.isLogin,productController.loadaddProduct)
admin_router.post('/add-product',upload.array('productImages',5),productController.insertProduct)
admin_router.get('/edit-product',adminAuth.isLogin,productController.loadeditProduct)
admin_router.post('/edit-product',adminAuth.isLogin,upload.array('productImages',5),productController.updateProduct)
admin_router.get('/delete-product',adminAuth.isLogin,productController.deleteProduct)
admin_router.get('/product-block',adminAuth.isLogin,productController.blockProduct)
admin_router.get('/product-unblock',adminAuth.isLogin,productController.UnBlockProduct)



admin_router.get('/orders',adminOrderController.orderPage)



admin_router.get("*", function (req, res) {
  res.redirect("/admin/home");
});


module.exports = admin_router;
