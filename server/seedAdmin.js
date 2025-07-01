// seedAdmin.js
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db.js");

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
connectDB();

// Admin user data
const adminData = {
  firstName: "Admin",
  lastName: "User",
  email: "ahmedsoumri01@gmail.com",
  password: "admin123", // Change this in production
  role: "admin",
};

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("⚠️ Admin user already exists.");
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create admin user
    const admin = new User({
      ...adminData,
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Default admin user created successfully");
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: *********** (hashed)`);
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

seedAdmin();
