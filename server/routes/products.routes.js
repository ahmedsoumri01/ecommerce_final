// routes/products.routes.js
const express = require("express");
const router = express.Router();

// Middlewares
const { adminMiddleware } = require("../middlewares/auth.middleware");
const { uploadMultiple } = require("../middlewares/upload.middleware");

// Controller
const productsController = require("../controllers/products.controller");

// Public Routes
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);

// Admin Protected Routes
router.post(
  "/create",
  adminMiddleware,
  uploadMultiple("images"),
  productsController.createProduct
);

router.put(
  "/:id",
  adminMiddleware,
  uploadMultiple("images"),
  productsController.updateProduct
);

router.delete("/:id", adminMiddleware, productsController.deleteProduct);

// Visibility & Stock Routes
router.put(
  "/toggle-visibility/:id",
  adminMiddleware,
  productsController.showHideProduct
);
router.put(
  "/toggle-stock/:id",
  adminMiddleware,
  productsController.inStockToggle
);

module.exports = router;
