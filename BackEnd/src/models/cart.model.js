const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// Calculate Cart Totals
// ======================================================

cartSchema.pre("save", function () {
  this.totalItems = this.items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  this.totalPrice = this.items.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
});

module.exports = mongoose.model("Cart", cartSchema);