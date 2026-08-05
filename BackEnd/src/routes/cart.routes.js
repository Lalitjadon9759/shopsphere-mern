const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cart.controller");

// ======================================================
// USER CART ROUTES
// ======================================================

// Get Logged-in User Cart
router.get(
  "/",
  auth,
  getCart
);

// Add Product To Cart
router.post(
  "/",
  auth,
  addToCart
);

// Update Product Quantity
router.patch(
  "/:productId",
  auth,
  updateCartItem
);

// Remove Product From Cart
router.delete(
  "/:productId",
  auth,
  removeCartItem
);

// Clear Entire Cart
router.delete(
  "/",
  auth,
  clearCart
);

module.exports = router;