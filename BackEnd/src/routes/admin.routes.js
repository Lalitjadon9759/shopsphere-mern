const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

const {
  getDashboard,
  getStatistics,
  getSalesReport,
  getRecentOrders,
  getTopProducts,
  getMonthlySales,
} = require("../controllers/admin.controller");

// Dashboard
router.get(
  "/dashboard",
  auth,
  roleCheck("admin"),
  getDashboard
);

// Statistics
router.get(
  "/statistics",
  auth,
  roleCheck("admin"),
  getStatistics
);

// Sales Report
router.get(
  "/sales-report",
  auth,
  roleCheck("admin"),
  getSalesReport
);

// Recent Orders
router.get(
  "/recent-orders",
  auth,
  roleCheck("admin"),
  getRecentOrders
);

// Top Products
router.get(
  "/top-products",
  auth,
  roleCheck("admin"),
  getTopProducts
);

// Monthly Sales
router.get(
  "/monthly-sales",
  auth,
  roleCheck("admin"),
  getMonthlySales
);

module.exports = router;