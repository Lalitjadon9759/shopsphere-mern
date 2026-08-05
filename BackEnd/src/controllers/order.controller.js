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
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    // Get User Cart
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate Address
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

    let orderItems = [];
    let subtotal = 0;

    // Validate Products & Stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `${item.product.name} is unavailable`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      const itemSubtotal = item.quantity * product.price;

      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image:
          product.images.length > 0
            ? product.images[0].url
            : "",
        quantity: item.quantity,
        price: product.price,
        subtotal: itemSubtotal,
      });
    }

    // Shipping Charge
    let shippingCharge = subtotal >= 999 ? 0 : 99;

    // Coupon
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
        now < coupon.validFrom ||
        now > coupon.validTill
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

      coupon.usedCount += 1;
      await coupon.save();

      couponId = coupon._id;
    }

    const totalAmount =
      subtotal + shippingCharge - discount;

    // Create Order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalItems: orderItems.length,
      subtotal,
      shippingCharge,
      discount,
      totalAmount,
      coupon: couponId,
    });

    // Update Stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    // Clear Cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await cart.save();

    const createdOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("shippingAddress");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// Get All Orders (Admin)
// ======================================================

exports.getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
    } = req.query;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("user", "name email phone")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / Number(limit)),
      totalOrders,
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
// Get Order By ID (Admin)
// ======================================================

exports.getOrderById = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("items.product")
      .populate("shippingAddress")
      .populate("coupon");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
      .sort({
        createdAt: -1,
      });

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
// Update Order Status (Admin)
// ======================================================

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;

      if (orderStatus === "Delivered") {
        order.deliveredAt = new Date();

        if (order.paymentMethod === "COD") {
          order.paymentStatus = "Paid";
        }
      }

      if (orderStatus === "Cancelled") {
        order.cancelledAt = new Date();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("shippingAddress");

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Cancel Order (User)
// ======================================================

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.orderStatus}`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.quantity,
          sold: -item.quantity,
        },
      });
    }
    if (order.coupon) {
  await Coupon.findByIdAndUpdate(order.coupon, {
    $inc: { usedCount: -1 },
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Delete Order (Admin)
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

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
