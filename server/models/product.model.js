// models/product.model.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      default: "",
    },
    nameFr: {
      type: String,
      default: "",
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      default: "",
    },
    descriptionFr: {
      type: String,
      default: "",
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    productRef: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    audience: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    visits: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
