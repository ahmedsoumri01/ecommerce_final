// routes/categories.routes.js
const express = require("express");
const router = express.Router();

// Import middlewares
const { adminMiddleware } = require("../middlewares/auth.middleware");
const { uploadSingle } = require("../middlewares/upload.middleware");

// Import controller
const categoriesController = require("../controllers/categories.controller");

// Public Routes
router.get("/", categoriesController.getAllCategories);
router.get("/:id", categoriesController.getCategoryById);

// Admin Protected Routes
router.post(
  "/create",
  adminMiddleware,
  uploadSingle("image"),
  categoriesController.createCategory
);

router.put(
  "/:id",
  adminMiddleware,
  uploadSingle("image"),
  categoriesController.updateCategory
);

router.delete("/:id", adminMiddleware, categoriesController.deleteCategory);

module.exports = router;
