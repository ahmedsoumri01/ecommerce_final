// middleware/upload.middleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define base upload directory
const UPLOAD_DIR = path.join(__dirname, "../uploads");
const CATEGORY_DIR = path.join(UPLOAD_DIR, "categories");
const PRODUCT_DIR = path.join(UPLOAD_DIR, "products");
const CAROUSEL_DIR = path.join(UPLOAD_DIR, "carousel");

/**
 * 1. Create upload directories if they don't exist
 */
function createUploadDirectories() {
  [UPLOAD_DIR, CATEGORY_DIR, PRODUCT_DIR, CAROUSEL_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
}

/**
 * 2. Configure Multer storage engine
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set folder dynamically based on request body or default to 'products'
    let dir = PRODUCT_DIR;
    switch (req.body.type) {
      case "category":
        dir = CATEGORY_DIR;
        break;
      case "product":
        dir = PRODUCT_DIR;
        break;
      case "carousel":
        dir = CAROUSEL_DIR;
        break;
      default:
        dir = PRODUCT_DIR;
    }

    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    const filename = file.fieldname + "-" + uniqueSuffix;
    cb(null, filename);
  },
});

const upload = multer({ storage });

/**
 * 3. Multer middleware for single upload
 */
exports.uploadSingle = (fieldName = "image") => {
  return upload.single(fieldName);
};

/**
 * 4. Multer middleware for multiple uploads
 */
exports.uploadMultiple = (fieldName = "images", maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

/**
 * 5. Utility function to delete a file from the server
 */
exports.deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log(`🗑️ Deleted file: ${fullPath}`);
  } else {
    console.warn(`⚠️ File not found for deletion: ${fullPath}`);
  }
};

/**
 * Export directories for reference in routes/controllers
 */
exports.directories = {
  UPLOAD_DIR,
  CATEGORY_DIR,
  PRODUCT_DIR,
  CAROUSEL_DIR,
};

// Run once when module is loaded
createUploadDirectories();
