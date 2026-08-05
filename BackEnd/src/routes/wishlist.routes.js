const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlist.controller");

// ======================================================
// USER WISHLIST ROUTES
// ======================================================

// Get Logged-in User Wishlist
router.get(
  "/",
  auth,
  getWishlist
);

// Add Product To Wishlist
router.post(
  "/",
  auth,
  addToWishlist
);

// Remove Product From Wishlist
router.delete(
  "/:productId",
  auth,
  removeFromWishlist
);

// Clear Wishlist
router.delete(
  "/",
  auth,
  clearWishlist
);

module.exports = router;