// routes/orders.routes.js
const express = require("express");
const router = express.Router();

// Middlewares
const { adminMiddleware } = require("../middlewares/auth.middleware");

// Controllers
const ordersController = require("../controllers/orders.controller");

// Public Routes
router.get("/", adminMiddleware, ordersController.getAllOrders); // Admin only for now
router.get("/:id", adminMiddleware, ordersController.getOrderById);
router.get("/reference/:orderRef", ordersController.getOrderByReference); // Can be public or protected

// Admin Protected Routes
router.post("/create", adminMiddleware, ordersController.createOrder);
router.put("/:id", adminMiddleware, ordersController.updateOrder);
router.delete("/:id", adminMiddleware, ordersController.deleteOrder);
router.put("/status/:id", adminMiddleware, ordersController.changeOrderStatus);
router.put("/cancel/:id", adminMiddleware, ordersController.cancelOrder);

module.exports = router;
