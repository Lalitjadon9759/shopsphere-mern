const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/rolecheck");

const {
  getDashboard,
  getStatistics,
  getSalesReport,
  getRecentOrders,
  getTopProducts,
  getMonthlySales,
} = require("../controllers/admin.controller");

// All admin routes require authentication + admin role
router.use(auth);
router.use(roleCheck("admin"));

// Dashboard Summary
router.get("/dashboard", getDashboard);

// Statistics
router.get("/statistics", getStatistics);

// Sales Report
router.get("/sales-report", getSalesReport);

// Recent Orders
router.get("/recent-orders", getRecentOrders);

// Top Selling Products
router.get("/top-products", getTopProducts);

// Monthly Sales
router.get("/monthly-sales", getMonthlySales);

module.exports = router;