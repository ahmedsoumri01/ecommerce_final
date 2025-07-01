// seedTestData.js
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Category = require("./models/category.model");
const Product = require("./models/product.model");
const Order = require("./models/order.model");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
connectDB();

// Sample category names
const categoryNames = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Books",
  "Sports",
];

// Sample product names grouped by category
const productSamples = {
  Electronics: [
    { name: "Smartphone", brand: "BrandX" },
    { name: "Laptop", brand: "TechPro" },
    { name: "Wireless Headphones", brand: "SoundMax" },
  ],
  Clothing: [
    { name: "T-Shirt", brand: "FashionCo" },
    { name: "Jeans", brand: "DenimWorld" },
    { name: "Jacket", brand: "WinterGear" },
  ],
  "Home & Garden": [
    { name: "Table Lamp", brand: "Homy" },
    { name: "Garden Chair", brand: "OutdoorLife" },
    { name: "Blender", brand: "KitchenMaster" },
  ],
  Books: [
    { name: "Programming Guide", brand: "LearnIt" },
    { name: "Cookbook", brand: "ChefMate" },
    { name: "Novel", brand: "StoryWorld" },
  ],
  Sports: [
    { name: "Soccer Ball", brand: "Sporty" },
    { name: "Dumbbells", brand: "FitLife" },
    { name: "Yoga Mat", brand: "ZenFit" },
  ],
};

// Sample client user
let clientUser;

// Generate random status
function getRandomStatus(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Seed Categories
async function seedCategories() {
  const categories = [];
  for (const name of categoryNames) {
    const category = new Category({
      name,
      nameAr: `${name} عربي`,
      nameFr: `${name} en français`,
      icon: `/icons/${name.toLowerCase().replace(" ", "-")}.png`,
      image: `/uploads/categories/image-1751328893753-157451311.jpg`,
      featured: Math.random() > 0.5,
    });
    await category.save();
    categories.push(category);
  }
  console.log(`✅ Created ${categories.length} categories`);
  return categories;
}

// Seed Products
async function seedProducts(categories) {
  const products = [];

  for (const categoryName in productSamples) {
    const category = categories.find((cat) => cat.name === categoryName);

    for (const prod of productSamples[categoryName]) {
      const product = new Product({
        name: prod.name,
        nameAr: `${prod.name} عربي`,
        nameFr: `${prod.name} en français`,
        brand: prod.brand,
        price: Math.floor(Math.random() * 500) + 50,
        originalPrice: Math.floor(Math.random() * 600) + 100,
        images: [`/uploads/products/images-1751330197499-72068119.png`],
        category: category._id,
        description: `High-quality ${prod.name} for everyday use.`,
        descriptionAr: `وصف المنتج بالعربية`,
        descriptionFr: `Description du produit en français`,
        inStock: Math.random() > 0.2,
        featured: Math.random() > 0.5,
        productRef: `PROD-${Math.random()
          .toString(36)
          .substring(2, 9)
          .toUpperCase()}`,
        audience: Math.random() > 0.5 ? "public" : "private",
      });

      await product.save();
      products.push(product);
    }
  }

  console.log(`✅ Created ${products.length} products`);
  return products;
}

// Seed Orders
async function seedOrders(products) {
  const orders = [];

  for (let i = 0; i < 40; i++) {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];

    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = product.price;
      total += price * quantity;

      items.push({
        product: product._id,
        quantity,
        price,
      });
    }

    const order = new Order({
      customerName: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phoneNumberOne: `+1234567890`,
      phoneNumbertwo: `+0987654321`,
      address: `123 Test St`,
      city: `Test City`,
      state: `TS`,
      comment: `Order #${i + 1} test comment`,
      orderRef: `ORDER-${Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase()}`,
      total,
      status: getRandomStatus([
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ]),
      items,
    });

    await order.save();
    orders.push(order);
  }

  console.log(`✅ Created ${orders.length} orders`);
}

// Main Seeder
async function runSeeder() {
  try {
    // Make sure admin exists first
    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      console.error(
        "❌ Admin not found. Please run 'npm run seed-admin' first."
      );
      process.exit(1);
    }

    // Find or create a test client user
    clientUser = await User.findOne({ email: "client@example.com" });
    if (!clientUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      clientUser = new User({
        firstName: "Test",
        lastName: "Client",
        email: "client@example.com",
        password: hashedPassword,
        role: "client",
      });
      await clientUser.save();
      console.log("✅ Created test client user");
    }

    // Clear previous test data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log("🗑️ Cleared old data");

    // Start seeding
    const categories = await seedCategories();
    const products = await seedProducts(categories);
    await seedOrders(products);
  } catch (error) {
    console.error("❌ Error during test data seeding:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

runSeeder();
