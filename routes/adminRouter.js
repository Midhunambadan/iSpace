const express = require("express");
const admin_router = express();
const path=require('path')

const adminController = require("../controllers/adminController/adminController");
const categoryController=require("../controllers/adminController/categoryController")
const userController=require('../controllers/userController/userController')
const productController=require('../controllers/adminController/productController')
const adminOrderController=require('../controllers/adminController/adminOrderController')
const adminCouponController=require('../controllers/adminController/adminCouponController')
const offerController=require('../controllers/adminController/offerController')
const salesReportController=require('../controllers/adminController/salesReportController')

const config = require("../config/config");
const session = require("express-session");
const multer=require('multer')

admin_router.use(session({
  secret:config.sessionSecret,
  resave:false,
  saveUninitialized:true
}))

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


// admin_router.get('/unblock-user',adminAuth.isLogin,adminController.ToggleblockUser)






// <<<<<<<<<<<<<<<<<<<<<For Products>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
admin_router.get("/products",adminAuth.isLogin, productController.loadProduct);
admin_router.get('/add-product',adminAuth.isLogin,productController.loadaddProduct)
admin_router.post('/add-product',upload.array('productImages',5),productController.insertProduct)
admin_router.get('/edit-product',adminAuth.isLogin,productController.loadeditProduct)
admin_router.post('/edit-product',adminAuth.isLogin,upload.array('productImages',5),productController.updateProduct)
admin_router.get('/delete-product',adminAuth.isLogin,productController.deleteProduct)
admin_router.get('/product-block',adminAuth.isLogin,productController.blockProduct)
admin_router.get('/product-unblock',adminAuth.isLogin,productController.UnBlockProduct)



admin_router.get('/load-coupon',adminAuth.isLogin,adminCouponController.loadCoupon)
admin_router.post('/add-coupon',adminAuth.isLogin,adminCouponController.addCoupon)
// admin_router.post('/add-coupon',adminCouponController.addCoupon)
admin_router.get('/delete-coupon',adminAuth.isLogin,adminCouponController.deleteCoupon)
admin_router.get('/block-coupon',adminAuth.isLogin,adminCouponController.couponBlock)

admin_router.get('/edit-coupon',adminAuth.isLogin,adminCouponController.editCoupon)
admin_router.post('/edit-coupon',adminAuth.isLogin,adminCouponController.updateCoupon)


admin_router.get('/offer-page',adminAuth.isLogin,offerController.loadOfferPage)
admin_router.post('/offer-page',offerController.addCategoroyOffer)
admin_router.get('/remove-offer',adminAuth.isLogin,offerController.removeCategoryOffer)

admin_router.get('/product-offer',adminAuth.isLogin,offerController.loadProductOffer)
admin_router.post('/product-offer',adminAuth.isLogin,offerController.addProductOffer)
admin_router.get('/remove-product-offer',adminAuth.isLogin,offerController.removeProductOffer)

admin_router.get('/orders',adminAuth.isLogin,adminOrderController.orderPage)
admin_router.get('/order-details',adminAuth.isLogin,adminOrderController.orderDetailsPage)
admin_router.post('/update-order-status',adminOrderController.orderStatusChange)


admin_router.get('/sales-report',adminAuth.isLogin,salesReportController.loadSalesReport)
admin_router.post('/search-sales-report',adminAuth.isLogin,salesReportController.searchSalesReportWithDate)




admin_router.get("*", function (req, res) {
  res.redirect("/admin/home");
});

admin_router.get('/404',adminController.invalidPage)

module.exports = admin_router;
