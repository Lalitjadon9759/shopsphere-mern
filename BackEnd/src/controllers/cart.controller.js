const mongoose = require("mongoose");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// ======================================================
// Get Cart
// ======================================================

exports.getCart = async (req, res) => {
  try {
    console.log("🛒 GET CART - User:", req.user?.id);

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from authentication token",
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        user: req.user.id,
      },
      {
        $setOnInsert: {
          user: req.user.id,
          items: [],
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).populate("items.product");

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("❌ GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Add To Cart
// ======================================================

exports.addToCart = async (req, res) => {
  try {
    console.log("🛒 ADD TO CART REQUEST");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    // --------------------------------------------------
    // Authentication check
    // --------------------------------------------------

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "User ID missing from authentication token",
      });
    }

    // --------------------------------------------------
    // Get request data
    // --------------------------------------------------

    const { productId, quantity = 1 } = req.body;

    // --------------------------------------------------
    // Validate Product ID
    // --------------------------------------------------

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // --------------------------------------------------
    // Validate Quantity
    // --------------------------------------------------

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    // --------------------------------------------------
    // Find Product
    // --------------------------------------------------

    const product = await Product.findById(productId);

    console.log(
      "Product:",
      product ? product.name : "NOT FOUND"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // --------------------------------------------------
    // Check Product Status
    // --------------------------------------------------

    if (product.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Product is inactive",
      });
    }

    // --------------------------------------------------
    // Check Stock
    // --------------------------------------------------

    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    // --------------------------------------------------
    // Get Existing Cart
    // --------------------------------------------------

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // --------------------------------------------------
    // Create Cart If It Doesn't Exist
    // --------------------------------------------------

    if (!cart) {
      try {
        cart = await Cart.create({
          user: req.user.id,
          items: [],
        });

        console.log("🆕 New cart created:", cart._id);
      } catch (createError) {
        // Handle race condition when another request
        // creates the cart at the same time.
        if (createError.code === 11000) {
          cart = await Cart.findOne({
            user: req.user.id,
          });
        } else {
          throw createError;
        }
      }
    }

    // --------------------------------------------------
    // Product Price
    // --------------------------------------------------

    const productPrice =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    // --------------------------------------------------
    // Check Whether Product Already Exists
    // --------------------------------------------------

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId
    );

    // --------------------------------------------------
    // Existing Product
    // --------------------------------------------------

    if (itemIndex !== -1) {
      const currentQuantity =
        Number(cart.items[itemIndex].quantity);

      const newQuantity =
        currentQuantity + qty;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available`,
        });
      }

      cart.items[itemIndex].quantity = newQuantity;

      cart.items[itemIndex].price = productPrice;
    }

    // --------------------------------------------------
    // New Product
    // --------------------------------------------------

    else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price: productPrice,
      });
    }

    // --------------------------------------------------
    // Save Cart
    // --------------------------------------------------

    await cart.save();

    // --------------------------------------------------
    // Get Updated Cart With Product Details
    // --------------------------------------------------

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    console.log("✅ CART UPDATED");

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("❌ ADD TO CART ERROR:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Update Cart Item
// ======================================================

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Check product stock
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (qty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    item.quantity = qty;

    // Update price if product price changed
    item.price =
      product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("❌ UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Remove Cart Item
// ======================================================

exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(
      cart._id
    ).populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("❌ REMOVE CART ITEM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Clear Cart
// ======================================================

exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("❌ CLEAR CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};