// controllers/categories.controller.js
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new category (with image upload)
exports.createCategory = async (req, res) => {
  const { name, nameAr, nameFr, featured } = req.body;

  let imagePath = "";
  if (req.file) {
    imagePath = `/uploads/categories/${req.file.filename}`;
  }

  try {
    const category = new Category({
      name,
      nameAr,
      nameFr,
      image: imagePath,
      featured: featured === "true",
    });

    await category.save();
    res.status(201).json({ message: "Category created", category });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing category (with optional image upload)
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, nameAr, nameFr, featured } = req.body;

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Handle image update
  let imagePath = category.image;
  if (req.file) {
    // Delete old image if it exists
    if (category.image) {
      const oldImagePath = path.join(__dirname, "..", category.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    imagePath = `/uploads/categories/${req.file.filename}`;
  }

  try {
    category.name = name || category.name;
    category.nameAr = nameAr || category.nameAr;
    category.nameFr = nameFr || category.nameFr;
    category.image = imagePath;
    category.featured =
      featured !== undefined ? featured === "true" : category.featured;

    await category.save();

    res.json({ message: "Category updated", category });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  try {
    // Delete image file if exists
    if (category.image) {
      const imagePath = path.join(__dirname, "..", category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
