const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
} = require("../controllers/payment.controller");

// Create Razorpay Order
router.post(
  "/create-order",
  auth,
  createOrder
);

// Verify Payment
router.post(
  "/verify",
  auth,
  verifyPayment
);

// Payment Details
router.get(
  "/:id",
  auth,
  getPaymentDetails
);

module.exports = router;