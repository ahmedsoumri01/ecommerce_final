// routes/products.routes.js
const express = require("express");
const router = express.Router();

// Middlewares
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");
const { uploadMultiple } = require("../middlewares/upload.middleware");

// Controller
const productsController = require("../controllers/products.controller");

// Public Routes
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);

// Admin Protected Routes
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  uploadMultiple("images"),
  productsController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadMultiple("images"),
  productsController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productsController.deleteProduct
);

// Visibility & Stock Routes
router.put(
  "/toggle-visibility/:id",
  authMiddleware,
  adminMiddleware,
  productsController.showHideProduct
);
router.put(
  "/toggle-stock/:id",
  authMiddleware,
  adminMiddleware,
  productsController.inStockToggle
);

module.exports = router;
