const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Address = require("../models/address.model");
const Coupon = require("../models/coupon.model");

// ======================================================
// Create Order
// ======================================================

exports.createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      couponCode,
    } = req.body;

    // ==================================================
    // Validate Payment Method
    // ==================================================

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // ==================================================
    // Get User Cart
    // ==================================================

    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ==================================================
    // Validate Address
    // ==================================================

    const address = await Address.findOne({
      _id: shippingAddress,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    // ==================================================
    // Validate Products + Stock
    // ==================================================

    const orderItems = [];

    let subtotal = 0;
    let totalItems = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `${item.product?.name || "Product"} is unavailable`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock`,
        });
      }

      // Use discount price if available
      const itemPrice =
        product.discountPrice > 0 &&
        product.discountPrice < product.price
          ? product.discountPrice
          : product.price;

      const itemSubtotal = item.quantity * itemPrice;

      subtotal += itemSubtotal;

      totalItems += Number(item.quantity);

      orderItems.push({
        product: product._id,
        name: product.name,

        image:
          product.images?.length > 0
            ? product.images[0].url
            : "",

        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
      });
    }

    // ==================================================
    // Shipping
    // ==================================================

    const shippingCharge = subtotal >= 999 ? 0 : 99;

    // ==================================================
    // Coupon
    // ==================================================

    let discount = 0;
    let couponId = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon",
        });
      }

      const now = new Date();

      if (
        (coupon.validFrom && now < coupon.validFrom) ||
        (coupon.validTill && now > coupon.validTill)
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon expired",
        });
      }

      if (
        coupon.minimumOrderAmount &&
        subtotal < coupon.minimumOrderAmount
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
        });
      }

      if (
        coupon.usageLimit > 0 &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message: "Coupon usage limit reached",
        });
      }

      if (coupon.discountType === "percentage") {
        discount =
          (subtotal * coupon.discountValue) / 100;

        if (
          coupon.maximumDiscount > 0 &&
          discount > coupon.maximumDiscount
        ) {
          discount = coupon.maximumDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      // Never allow discount greater than subtotal
      discount = Math.min(discount, subtotal);

      coupon.usedCount += 1;

      await coupon.save();

      couponId = coupon._id;
    }

    // ==================================================
    // Final Server-Side Total
    // ==================================================

    const totalAmount = Math.max(
      0,
      subtotal + shippingCharge - discount
    );

    // ==================================================
    // Create Order
    // ==================================================

    const order = await Order.create({
      user: req.user.id,

      items: orderItems,

      shippingAddress: address._id,

      paymentMethod,

      totalItems,

      subtotal,

      shippingCharge,

      discount,

      totalAmount,

      coupon: couponId,
    });

    // ==================================================
    // Update Stock
    // ==================================================

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    // ==================================================
    // Clear Cart
    // ==================================================

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    // ==================================================
    // Return Complete Order
    // ==================================================

    const createdOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate("items.product");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

// ======================================================
// Get All Orders - ADMIN
// ======================================================

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

// ======================================================
// Get Single Order
// ======================================================

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // User can only see their own order
    // Admin can see any order
    if (
      order.user._id.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

// ======================================================
// Get Logged-in User Orders
// ======================================================

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("shippingAddress")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your orders",
    });
  }
};

// ======================================================
// Update Order Status - ADMIN
// ======================================================

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    if (status === "Cancelled") {
      order.cancelledAt = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("shippingAddress")
      .populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to update order status",
    });
  }
};

// ======================================================
// Cancel Order - USER
// ======================================================

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      ["Shipped", "Out for Delivery", "Delivered", "Cancelled"].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is ${order.orderStatus}`,
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
          sold: -item.quantity,
        },
      });
    }

    order.orderStatus = "Cancelled";
    order.cancelledAt = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order",
    });
  }
};

// ======================================================
// Delete Order - ADMIN
// ======================================================

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete order",
    });
  }
};