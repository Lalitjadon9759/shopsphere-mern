const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const upload = require("../middleware/upload");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
} = require("../controllers/product.controller");

// ==================== Public Routes ====================

// Get all products
// Supports:
// ?page=1
// ?limit=10
// ?search=iphone
// ?category=<categoryId>
// ?minPrice=100
// ?maxPrice=500
// ?sort=price_asc
// ?sort=price_desc
// ?sort=latest
router.get("/", getProducts);

// Featured products
router.get("/featured", getFeaturedProducts);

// Related products
router.get("/related/:id", getRelatedProducts);

// Single product by slug
router.get("/:slug", getProductBySlug);

// ==================== Admin Routes ====================

// Create Product
router.post(
  "/",
  auth,
  roleCheck("admin"),
  upload.array("images", 5),
  createProduct
);

// Update Product
router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  upload.array("images", 5),
  updateProduct
);

// Delete Product
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteProduct
);

module.exports = router;