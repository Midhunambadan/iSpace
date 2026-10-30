const mongoose = require("mongoose");

const wishListSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },

  products: [
    {
      productId: { type: mongoose.Schema.ObjectId, ref: "Product" },
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishListSchema);
