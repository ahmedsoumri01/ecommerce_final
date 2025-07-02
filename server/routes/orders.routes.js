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
