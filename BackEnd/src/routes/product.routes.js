const express = require("express");

const router = express.Router();

// ======================================================
// Middleware
// ======================================================

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const upload = require("../middleware/upload");

// ======================================================
// Controllers
// ======================================================

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
} = require("../controllers/product.controller");

// ======================================================
// PUBLIC PRODUCT ROUTES
// ======================================================

// ------------------------------------------------------
// Get All Products
// ------------------------------------------------------
// Supports:
//
// ?page=1
// ?limit=8
// ?search=iphone
// ?category=categoryId
// ?minPrice=100
// ?maxPrice=5000
// ?sort=latest
// ?sort=oldest
// ?sort=price_asc
// ?sort=price_desc
// ?sort=rating
// ?sort=name
//
// Example:
// GET /api/products
// GET /api/products?search=iphone
// GET /api/products?category=electronics
// GET /api/products?search=iphone&sort=price_asc
// ------------------------------------------------------

router.get("/", getProducts);

// ------------------------------------------------------
// Featured Products
// ------------------------------------------------------
// GET /api/products/featured
// ------------------------------------------------------

router.get("/featured", getFeaturedProducts);

// ------------------------------------------------------
// Related Products
// ------------------------------------------------------
// GET /api/products/related/:id
// ------------------------------------------------------

router.get("/related/:id", getRelatedProducts);

// ======================================================
// ADMIN PRODUCT ROUTES
// ======================================================

// ------------------------------------------------------
// Get Product By ID - Admin
// ------------------------------------------------------
// GET /api/products/admin/:id
// ------------------------------------------------------

router.get(
  "/admin/:id",
  auth,
  roleCheck("admin"),
  getProductById
);

// ------------------------------------------------------
// Create Product
// ------------------------------------------------------
// POST /api/products
// ------------------------------------------------------

router.post(
  "/",
  auth,
  roleCheck("admin"),
  upload.array("images", 5),
  createProduct
);

// ------------------------------------------------------
// Update Product
// ------------------------------------------------------
// PUT /api/products/:id
// ------------------------------------------------------

router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  upload.array("images", 5),
  updateProduct
);

// ------------------------------------------------------
// Delete Product
// ------------------------------------------------------
// DELETE /api/products/:id
// ------------------------------------------------------

router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteProduct
);

// ======================================================
// GET PRODUCT BY SLUG
// ======================================================
// IMPORTANT:
// Keep this dynamic route LAST.
//
// GET /api/products/iphone-15
// GET /api/products/samsung-galaxy-s24
// ======================================================

router.get("/:slug", getProductBySlug);

// ======================================================
// EXPORT
// ======================================================

module.exports = router;