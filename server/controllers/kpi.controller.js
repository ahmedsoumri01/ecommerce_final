const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");
const Order = require("../models/order.model.js");
const Category = require("../models/category.model.js");
const mongoose = require("mongoose");

// Increment visit count for a product
exports.incrementProductVisit = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.visits = (product.visits || 0) + 1;
    await product.save();
    res.json({ visits: product.visits });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total visits for all products
exports.getTotalVisits = async (req, res) => {
  try {
    const products = await Product.find({}, "visits");
    const total = products.reduce((sum, p) => sum + (p.visits || 0), 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get visits for a specific product
exports.getProductVisits = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ visits: product.visits || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total users
exports.getTotalUsers = async (req, res) => {
  try {
    const total = await User.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total products and in-stock/out-of-stock breakdown
exports.getProductStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const inStock = await Product.countDocuments({ inStock: true });
    const outStock = await Product.countDocuments({ inStock: false });
    res.json({ total, inStock, outStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders count grouped by status
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total categories
exports.getTotalCategories = async (req, res) => {
  try {
    const total = await Category.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get recent activities (last 10 created users, products, orders, categories)
exports.getRecentActivities = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(3);
    const products = await Product.find().sort({ createdAt: -1 }).limit(3);
    const orders = await Order.find().sort({ createdAt: -1 }).limit(3);
    const categories = await Category.find().sort({ createdAt: -1 }).limit(3);
    res.json({ users, products, orders, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total visits by month and by day
exports.getVisitsStats = async (req, res) => {
  try {
    // By month
    const byMonth = await Product.aggregate([
      { $match: { visits: { $gt: 0 } } },
      { $project: { month: { $month: "$updatedAt" }, visits: 1 } },
      { $group: { _id: "$month", total: { $sum: "$visits" } } },
      { $sort: { _id: 1 } },
    ]);
    // By day
    const byDay = await Product.aggregate([
      { $match: { visits: { $gt: 0 } } },
      { $project: { day: { $dayOfMonth: "$updatedAt" }, visits: 1 } },
      { $group: { _id: "$day", total: { $sum: "$visits" } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ byMonth, byDay });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get top visited products
exports.getTopVisitedProducts = async (req, res) => {
  try {
    const top = await Product.find({ visits: { $gt: 0 } })
      .sort({ visits: -1 })
      .limit(5)
      .select("name visits");
    res.json({ top });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
