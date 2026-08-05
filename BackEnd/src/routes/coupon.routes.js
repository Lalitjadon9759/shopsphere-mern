const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const {
  createCoupon,
  getCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/coupon.controller");

// ================= PUBLIC / USER =================

// Validate Coupon
router.post(
  "/validate",
  auth,
  validateCoupon
);

// ================= ADMIN =================

// Create Coupon
router.post(
  "/",
  auth,
  roleCheck("admin"),
  createCoupon
);

// Get All Coupons
router.get(
  "/",
  auth,
  roleCheck("admin"),
  getCoupons
);

// Get Coupon By ID
router.get(
  "/:id",
  auth,
  roleCheck("admin"),
  getCouponById
);

// Update Coupon
router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  updateCoupon
);

// Delete Coupon
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteCoupon
);

module.exports = router;