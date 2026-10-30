const Wishlist = require("../../models/wishlistModel");
const Product = require("../../models/productModel");

//userWishlist

const loaduserWishlist = async (req, res) => {
  try {
    const userId = req.session.user_id;
    let wishList = await Wishlist.findOne({ userId }).populate(
      "products.productId"
    );

    res.render("userWishlist", { wishlist: wishList });
  } catch (error) {
    console.log(error.message);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const proId = req.body.id; // Assuming the product ID is sent in the request body
    const product = await Product.findById(proId);

    const userId = req.session.user_id;

    let wishList = await Wishlist.findOne({ userId });

    if (!wishList) {
      wishList = new Wishlist({
        userId,
        products: [{ productId: proId }],
      });
    } else {
      if (!wishList.products.some((item) => item.productId.equals(proId))) {
        wishList.products.push({ productId: proId });
      }
    }

    await wishList.save();
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ==================================================================================================================

const deleteWishlist = async (req, res) => {
  try {
    const productId = req.query.id;
    const userId = req.session.user_id;

    const userWishlistData = await Wishlist.find({ userId: userId });

    const wishlistData = await Wishlist.updateOne(
      { userId: userId },
      { $pull: { products: { productId: productId } } }
    );

    res.redirect("/wishlist");
  } catch (error) {}
};

module.exports = {
  addToWishlist,
  loaduserWishlist,
  deleteWishlist,
};
