// controllers/products.controller.js
const Product = require("../models/product.model");
const fs = require("fs");
const path = require("path");
const { directories } = require("../middlewares/upload.middleware");

// Get all products (excluding private ones unless admin)
exports.getAllProducts = async (req, res) => {
  try {
    let query = {};
    // If user is not admin, filter out private products
    if (!req.user || req.user.role !== "admin") {
      query.audience = "public";
    }

    const products = await Product.find(query).populate("category", "name");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("category", "name");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Non-admin users can't see private products
    if (product.audience === "private" && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  const {
    name,
    nameAr,
    nameFr,
    brand,
    price,
    originalPrice,
    category,
    description,
    descriptionAr,
    descriptionFr,
    featured,
    productRef,
    audience,
    inStock,
  } = req.body;

  const imagePaths =
    req.files?.map((file) => `/uploads/products/${file.filename}`) || [];
  try {
    const product = new Product({
      name,
      nameAr,
      nameFr,
      brand,
      price,
      originalPrice,
      images: imagePaths,
      category,
      description,
      descriptionAr,
      descriptionFr,
      inStock,
      featured: featured === "true",
      productRef,
      audience: audience || "public",
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    nameAr,
    nameFr,
    brand,
    price,
    originalPrice,
    category,
    description,
    descriptionAr,
    descriptionFr,
    featured,
    productRef,
    inStock,
    audience,
  } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const imagePaths = req.files
    ? req.files.map((file) => `/uploads/products/${file.filename}`)
    : product.images;

  // Delete old images if new ones are uploaded
  if (req.files) {
    product.images.forEach((img) => {
      const fullPath = path.join(__dirname, "..", img);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });
  }

  try {
    product.name = name || product.name;
    product.nameAr = nameAr || product.nameAr;
    product.nameFr = nameFr || product.nameFr;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.originalPrice = originalPrice || product.originalPrice;
    product.images = imagePaths;
    product.category = category || product.category;
    product.description = description || product.description;
    product.descriptionAr = descriptionAr || product.descriptionAr;
    product.descriptionFr = descriptionFr || product.descriptionFr;
    product.featured =
      featured !== undefined ? featured === "true" : product.featured;
    product.productRef = productRef || product.productRef;
    product.audience = audience || product.audience;
    product.inStock =
      inStock !== undefined ? inStock === "true" : product.inStock;
    await product.save();

    res.json({ message: "Product updated", product });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    // Delete images
    product.images.forEach((img) => {
      const fullPath = path.join(__dirname, "..", img);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle product visibility (public/private)
exports.showHideProduct = async (req, res) => {
  const { id } = req.params;
  const { audience } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    product.audience = audience || "public";
    await product.save();
    res.json({ message: "Visibility updated", product });
  } catch (error) {
    console.error("Error toggling visibility:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle inStock status
exports.inStockToggle = async (req, res) => {
  const { id } = req.params;
  const { inStock } = req.body;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  try {
    product.inStock = inStock === "true";
    await product.save();
    res.json({ message: "In stock status updated", product });
  } catch (error) {
    console.error("Error toggling in stock:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
