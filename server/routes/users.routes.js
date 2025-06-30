// routes/users.routes.js
const express = require("express");
const router = express.Router();

// Middlewares
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");

// Controllers
const usersController = require("../controllers/users.controllers");

// Admin Protected Routes
router.get("/", authMiddleware, adminMiddleware, usersController.getAllUsers);
router.get("/:id", authMiddleware, usersController.getUserById);
router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  usersController.createUser
);
router.put("/:id", authMiddleware, usersController.updateUser);
router.put(
  "/change-password/:id",
  authMiddleware,
  usersController.changePassword
);
router.put(
  "/block/:id",
  authMiddleware,
  adminMiddleware,
  usersController.blockUser
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  usersController.deleteUser
);

module.exports = router;
