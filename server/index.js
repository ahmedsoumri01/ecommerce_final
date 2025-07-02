const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const ordersRoutes = require("./routes/orders.routes.js");
const productsRoutes = require("./routes/products.routes.js");
const categoryRoutes = require("./routes/categories.routes");
const orderRoutes = require("./routes/orders.routes");
const userRoutes = require("./routes/users.routes");
const kpiRoutes = require("./routes/kpi.routes.js");
const pdfRoutes = require("./routes/pdf.routes.js");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();
// Initialize Express app
const app = express();
// Enable CORS for all requests
const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Allow requests without origin
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      console.log("Origin blocked by CORS:", origin); // For debugging
      return callback(null, true); // Allow all origins for now until you debug
    },
    credentials: true,
  })
);

app.set("trust proxy", true);
// Serve static files (profile images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/kpi", kpiRoutes);
app.use("/api/pdf", pdfRoutes);
// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Set the port from environment variables or default to 3001
const PORT = process.env.PORT || 3002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
