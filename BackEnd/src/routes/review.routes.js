const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getReviews,
  toggleReviewStatus,
} = require("../controllers/review.controller");

// ================= USER ROUTES =================

// Create Review
router.post(
  "/",
  auth,
  createReview
);

// Get Reviews of a Product
router.get(
  "/product/:productId",
  getProductReviews
);

// Update Own Review
router.put(
  "/:id",
  auth,
  updateReview
);

// Delete Own Review
router.delete(
  "/:id",
  auth,
  deleteReview
);

// ================= ADMIN ROUTES =================

// Get All Reviews
router.get(
  "/",
  auth,
  roleCheck("admin"),
  getReviews
);

// Approve / Reject Review
router.patch(
  "/:id/toggle",
  auth,
  roleCheck("admin"),
  toggleReviewStatus
);

module.exports = router;