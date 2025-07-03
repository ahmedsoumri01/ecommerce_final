const express = require("express");
const router = express.Router();
const kpiController = require("../controllers/kpi.controller.js");

// Increment visit count for a product
router.post("/product/:productId/visit", kpiController.incrementProductVisit);

// Get total visits for all products
router.get("/total-visits", kpiController.getTotalVisits);

// Get visits for a specific product
router.get("/product/:productId/visits", kpiController.getProductVisits);

// Get total users
router.get("/users/total", kpiController.getTotalUsers);

// Get product statistics
router.get("/products/stats", kpiController.getProductStats);

// Get order statistics
router.get("/orders/stats", kpiController.getOrderStats);

// Get total categories
router.get("/categories/total", kpiController.getTotalCategories);

// Get recent activities
router.get("/recent-activities", kpiController.getRecentActivities);

// Get visit statistics
router.get("/visits/stats", kpiController.getVisitsStats);

// Get top visited products
router.get("/products/top-visited", kpiController.getTopVisitedProducts);

module.exports = router;
