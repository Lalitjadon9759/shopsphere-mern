const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");
const Category = require("../models/category.model");

// ======================================================
// Dashboard
// ======================================================

exports.getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCategories,
      revenueResult,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Category.countDocuments(),

      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),

      Order.countDocuments({ orderStatus: "Pending" }),
      Order.countDocuments({ orderStatus: "Delivered" }),
      Order.countDocuments({ orderStatus: "Cancelled" }),
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalCategories,
        totalRevenue: revenueResult.length
          ? revenueResult[0].totalRevenue
          : 0,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Statistics
// ======================================================

exports.getStatistics = async (req, res) => {
  try {
    const [
      activeUsers,
      blockedUsers,
      featuredProducts,
      outOfStockProducts,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ isBlocked: false }),
      User.countDocuments({ isBlocked: true }),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ stock: 0 }),

      Order.aggregate([
        { $match: { paymentStatus: "Paid" } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      statistics: {
        activeUsers,
        blockedUsers,
        featuredProducts,
        outOfStockProducts,
        revenue: revenueResult.length
          ? revenueResult[0].totalRevenue
          : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Sales Report
// ======================================================

exports.getSalesReport = async (req, res) => {
  try {
    const { from, to } = req.query;

    const filter = {
      paymentStatus: "Paid",
    };

    if (from && to) {
      filter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const totalProductsSold = orders.reduce(
      (sum, order) => sum + order.totalItems,
      0
    );

    return res.status(200).json({
      success: true,
      report: {
        totalOrders: orders.length,
        totalProductsSold,
        totalRevenue,
        orders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Recent Orders
// ======================================================

exports.getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Top Selling Products
// ======================================================

exports.getTopProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const products = await Product.find({ isActive: true })
      .select("name slug price stock sold rating totalReviews images")
      .sort({ sold: -1, rating: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Monthly Sales Analytics
// ======================================================

exports.getMonthlySales = async (req, res) => {
  try {
    const year = Number(req.query.year) || new Date().getFullYear();

    const sales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const result = months.map((month, index) => {
      const data = sales.find((item) => item._id.month === index + 1);

      return {
        month,
        revenue: data ? data.revenue : 0,
        orders: data ? data.orders : 0,
      };
    });

    return res.status(200).json({
      success: true,
      year,
      sales: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};