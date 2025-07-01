// order.model.js
const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumberOne: {
      type: String,
      required: true,
    },
    phoneNumbertwo: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    comment: {
      type: String,
    },
    orderRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    items: [OrderItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
