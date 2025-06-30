// controllers/users.controller.js
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    console.log({
      from: "getAllUsers",
    });
    const users = await User.find().select("-password"); // Exclude password
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID (Admin or self)
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow admin or user themselves to access
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new user (Admin only)
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "client",
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser.select("-password"),
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user (Admin or self)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow admin or self to update
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if (req.user.role === "admin") {
      user.role = role || user.role;
    }

    await user.save();

    res.json({
      message: "User updated successfully",
      user: user.select("-password"),
    });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Change password (Admin or self)
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow admin or self to change password
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // If user is not admin, validate current password
    if (
      req.user.role !== "admin" &&
      !(await bcrypt.compare(currentPassword, user.password))
    ) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Block/unblock user (Admin only)
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  const { accountStatus } = req.body; // 'active' or 'blocked'

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.accountStatus = accountStatus;
    await user.save();

    res.json({
      message: `User ${
        accountStatus === "blocked" ? "blocked" : "unblocked"
      } successfully`,
      user: user.select("-password"),
    });
  } catch (error) {
    console.error("Error blocking user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
