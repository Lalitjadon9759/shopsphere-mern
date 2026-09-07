const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const {
  createOrder,
  getOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/order.controller");

// ======================================================
// USER ROUTES
// ======================================================

// Place Order
router.post("/", auth, createOrder);

// Logged-in user's orders
router.get("/my-orders", auth, getMyOrders);

// Cancel Order
router.patch("/cancel/:id", auth, cancelOrder);

// ======================================================
// ADMIN ROUTES
// ======================================================

// Get all orders
router.get("/", auth, roleCheck("admin"), getOrders);

// Get single order
router.get("/:id", auth, getOrderById);

// Update order status
router.patch(
  "/:id/status",
  auth,
  roleCheck("admin"),
  updateOrderStatus
);

// Delete order
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteOrder
);

module.exports = router;