// routes/orders.routes.js
const express = require("express");
const router = express.Router();

// Middlewares
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/auth.middleware");

// Controllers
const ordersController = require("../controllers/orders.controller");

// Bulk actions (must be before /:id)
router.put(
  "/cancel-multiple",
  authMiddleware,
  adminMiddleware,
  ordersController.cancelMultipleOrders
);
router.put(
  "/status-multiple",
  authMiddleware,
  adminMiddleware,
  ordersController.changeStatusMultipleOrders
);
router.delete(
  "/delete-multiple",
  authMiddleware,
  adminMiddleware,
  ordersController.deleteMultipleOrders
);
// Admin: Clear all order blocks
router.post(
  "/clear-blocks",

  ordersController.clearOrderBlocks
);
// Public Routes
router.get("/", authMiddleware, adminMiddleware, ordersController.getAllOrders); // Admin only for now
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  ordersController.getOrderById
);
router.get("/reference/:orderRef", ordersController.getOrderByReference); // Can be public or protected

// Admin Protected Routes
router.put(
  "/confirm-multiple",
  authMiddleware,
  adminMiddleware,
  ordersController.confirmOrders
);
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  ordersController.createOrder
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  ordersController.updateOrder
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  ordersController.deleteOrder
);
router.put(
  "/status/:id",
  authMiddleware,
  adminMiddleware,
  ordersController.changeOrderStatus
);
router.put(
  "/cancel/:id",
  authMiddleware,
  adminMiddleware,
  ordersController.cancelOrder
);
module.exports = router;
