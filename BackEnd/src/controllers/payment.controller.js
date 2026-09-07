const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Payment = require("../models/payment.model");
const Order = require("../models/order.model");

// ======================================================
// Create Razorpay Order
// ======================================================

exports.createOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Get only user's own order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Payment only for ONLINE orders
    if (order.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message:
          "This order is not configured for online payment",
      });
    }

    // Already paid
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    // Invalid amount
    if (
      !Number.isFinite(order.totalAmount) ||
      order.totalAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount",
      });
    }

    // ==================================================
    // Create Razorpay Order
    // ==================================================

    const options = {
      amount: Math.round(
        order.totalAmount * 100
      ),
      currency: "INR",
      receipt: `order_${order._id}`,
    };

    const razorpayOrder =
      await razorpay.orders.create(options);

    // ==================================================
    // Save Payment
    // ==================================================

    const payment = await Payment.create({
      user: req.user.id,
      order: order._id,
      razorpayOrderId:
        razorpayOrder.id,
      amount: order.totalAmount,
      currency:
        razorpayOrder.currency || "INR",
      status: "Pending",
      paymentMethod: "Razorpay",
    });

    // Save Razorpay order ID on ShopSphere order
    order.razorpayOrderId =
      razorpayOrder.id;

    await order.save();

    return res.status(201).json({
      success: true,

      key:
        process.env.RAZORPAY_KEY_ID,

      payment,

      order: razorpayOrder,
    });

  } catch (error) {
    console.error(
      "Create Razorpay Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create payment order",
    });
  }
};

// ======================================================
// Verify Payment
// ======================================================

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Complete payment information is required",
      });
    }

    // ==================================================
    // Find user's payment
    // ==================================================

    const payment =
      await Payment.findOne({
        razorpayOrderId:
          razorpay_order_id,
        user: req.user.id,
        order: orderId,
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message:
          "Payment record not found",
      });
    }

    // Already paid
    if (payment.status === "Paid") {
      return res.status(200).json({
        success: true,
        message:
          "Payment already verified",
        payment,
      });
    }

    // ==================================================
    // Generate Signature
    // ==================================================

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    // ==================================================
    // Compare Signature
    // ==================================================

    if (
      generatedSignature !==
      razorpay_signature
    ) {
      payment.status = "Failed";

      await payment.save();

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed",
      });
    }

    // ==================================================
    // Get User Order
    // ==================================================

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // ==================================================
    // Update Payment
    // ==================================================

    payment.razorpayPaymentId =
      razorpay_payment_id;

    payment.razorpaySignature =
      razorpay_signature;

    payment.status = "Paid";

    await payment.save();

    // ==================================================
    // Update Order
    // ==================================================

    order.paymentStatus = "Paid";

    order.razorpayOrderId =
      razorpay_order_id;

    order.razorpayPaymentId =
      razorpay_payment_id;

    order.razorpaySignature =
      razorpay_signature;

    // Move order forward
    if (
      order.orderStatus === "Pending"
    ) {
      order.orderStatus = "Confirmed";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        "Payment verified successfully",
      payment,
      order,
    });

  } catch (error) {
    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed",
    });
  }
};

// ======================================================
// Get Payment Details
// ======================================================

exports.getPaymentDetails = async (
  req,
  res
) => {
  try {
    const payment =
      await Payment.findOne({
        _id: req.params.id,
        user: req.user.id,
      })
        .populate(
          "user",
          "name email"
        )
        .populate("order");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};