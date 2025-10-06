const mongoose = require("mongoose");

const product = new mongoose.Schema({
  product_name: String,
  discription: String,
  MRP: Number,
  stock: {
    type: Number,
    required: true,
  },
  productImages: {
    type: Array,
  },
  discount: Number,
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
  listedDate: {
    type: Date,
    default: Date.now,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  productOffer: {
    name: {
      type: String,
    },
    offerPercentage: {
      type: Number,
      default: 0,
    },
    validity: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
});

module.exports = mongoose.model("Product", product);
