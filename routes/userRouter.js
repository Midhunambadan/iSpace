const express = require("express");
const router = express();
const userController = require("../controllers/userController");
const userCartController=require('../controllers/userCartController')
const addressController=require('../controllers/addressController')
const productController=require('../controllers/productController')
const wishlistController=require('../controllers/wishlishController')
const userOrderController=require('../controllers/userOrderController')

const session = require("express-session");
const config = require("../config/config");
router.use(session({ secret: config.sessionSecret })); ///new you can delete
const auth = require("../middleware/auth");

router.set("view engine", "ejs");
router.set("views", "./views/users");


router.use(express.json())
router.use(express.urlencoded({extended: true}));



//------------------user Credentials------------------------------------------------------

router.get("/signup", auth.isLogout, userController.loaduserRegister);
router.get("/login", auth.isLogout, userController.loaduserLogin);
router.post("/verifySignup", userController.verifySignup,userController.getOtp);
router.get("/getOtp", auth.isLogout, userController.getOtp);
router.post("/verifyOtp", auth.isLogout, userController.verifyOtp);
// router.get("/", auth.isLogout, userController.loaduserLogin);
router.post("/login", auth.isLogout, userController.verifyLogin);
router.get("/logout", auth.isLogin, userController.userLogout);
router.get("/", auth.isLogout, userController.loaduserHome);

//-----------------Forgot password----------------------------------------------------
router.get('/forgot',userController.loadForgotPassword)
router.post('/forgot',userController.getForgotOtp)

router.post('/verify-forgot-otp',userController.verifyForgotOtp)
router.post('/verify-forgot-otp',userController.loadPasswordReset)

router.get('/password-reset',userController.loadPasswordReset)
router.post('/verify-password-reset',userController.VerifyPasswordReset)

// ------------------After login>------------------------------------------------------

router.get("/home",auth.isLogin, userController.loaduserHome);


router.get("/wishlist", auth.isLogin, wishlistController.loaduserWishlist);
router.post('/add-to-wishlist',auth.isLogin,wishlistController.addToWishlist)
router.get('/delete-wishlist',auth.isLogin,wishlistController.deleteWishlist)



router.get("/show-product",auth.isLogin,userController.showProduct)
router.get("/all-product",userController.loadAllProduct)
router.post('/all-product',userController.loadAllProduct)

// router.get('/search-category',userController.searchCategory)

// ------------------User Cart------------------------------------------------------
router.get("/user-cart",auth.isLogin, userCartController.loadUserCart);
router.post('/add-to-cart',auth.isLogin,userCartController.addToCart)
router.get('/delete-cart',userCartController.deleteCart)
router.post('/update-cart',userCartController.updateCart)
router.post('/update-quantity',userCartController.updateQuantity)


//----------------------Address Start---------------------------------------
router.get("/userDashboard", auth.isLogin,userController.loaduserDashboard);
router.get('/order-details', auth.isLogin,userController.loadOrderDetails)

router.get('/cancel-order',auth.isLogin,userController.userOrderCancel)
router.get('/return-order',auth.isLogin,userController.useReturnOrder)


router.post('/insert-Address',addressController.insertAddress)
router.get('/edit-Address',addressController.loadEditAddress)
router.get('/delete-address/:id',addressController.deleteAddress)
router.post('/edit-Address',addressController.verifyEditAddress)

//----------------------Checkout page Start---------------------------------------


router.get('/checkout',auth.isLogin,userCartController.userCheckout)


router.post('/insert-checkout-address',userCartController.insertCheckoutAddress)
router.get('/delete-checkout-address/:id',userCartController.deleteCheckoutAddress)
// router.post('/edit-Address',addressController.verifyEditAddress)



// /------------------------Sort Start----------------------------------------------

router.get('/low-to-high',userController.priceLowToHigh)
router.get('/high-to-low',userController.priceHighToLow)
router.get('/a-z',userController.sortAtoZ)
router.get('/z-a',userController.sortZtoA)
router.get('/new-Arrivals',userController.newArrivals)


router.post('/search-product',userController.searchProduct)

// /------------------------Sort Start----------------------------------------------



//-----------Account-Profile--------------------------------------------------------

router.get('/change-password',userController.loadChangePassword)
router.post('/change-password',userController.verifyChangePassword)
router.post('/profile-edit',userController.verifyProfileEdit)


// ------------------orderController-----------------
router.post('/place-order',userOrderController.placeOrder)
router.get('/continue-shop',userOrderController.continueShop)
router.post('/paymentByRazorpay',userOrderController.paymentRazorpay)

router.post('/apply-coupon',userCartController.applyCoupon)
router.post('/remove-coupon',userCartController.removeCoupon)


module.exports = router;

