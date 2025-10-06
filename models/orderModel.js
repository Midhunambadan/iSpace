const mongoose = require("mongoose");

const orderModel = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],

  address: {
    name: String,
    mobile: String,
    houseName: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },

  orderId: { type: String },
  totalAmount: { type: String },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, required: true },
  razOrderId: { type: String },

  paymentStatus: {
    type: String,
    enum: ["Pending", "Recieved", "Failed", "Refund"],
    default: "Pending",
  },
  orderStatus: {
    type: String,
    enum: [
      "Order Placed",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Pending",
    ],
    default: "Order Placed",
  },
});

module.exports = mongoose.model("Order", orderModel);
