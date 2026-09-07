const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    // ======================================================
    // Coupon Code
    // ======================================================

    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [3, "Coupon code must be at least 3 characters"],
      maxlength: [30, "Coupon code cannot exceed 30 characters"],
    },

    // ======================================================
    // Description
    // ======================================================

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    // ======================================================
    // Discount Type
    // ======================================================

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "Discount type is required"],
    },

    // ======================================================
    // Discount Value
    // ======================================================

    discountValue: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },

    // ======================================================
    // Minimum Order Amount
    // ======================================================

    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: [0, "Minimum order amount cannot be negative"],
    },

    // ======================================================
    // Maximum Discount
    // ======================================================

    maximumDiscount: {
      type: Number,
      default: 0,
      min: [0, "Maximum discount cannot be negative"],
    },

    // ======================================================
    // Usage Limit
    // 0 = Unlimited
    // ======================================================

    usageLimit: {
      type: Number,
      default: 0,
      min: [0, "Usage limit cannot be negative"],
    },

    // ======================================================
    // Used Count
    // ======================================================

    usedCount: {
      type: Number,
      default: 0,
      min: [0, "Used count cannot be negative"],
    },

    // ======================================================
    // Valid From
    // ======================================================

    validFrom: {
      type: Date,
      required: [true, "Valid from date is required"],
    },

    // ======================================================
    // Valid Till
    // ======================================================

    validTill: {
      type: Date,
      required: [true, "Valid till date is required"],
    },

    // ======================================================
    // Active Status
    // ======================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// Validation
// ======================================================

couponSchema.pre("validate", function (next) {
  // Valid till must be after valid from
  if (
    this.validFrom &&
    this.validTill &&
    this.validTill <= this.validFrom
  ) {
    return next(
      new Error("Valid till date must be after valid from date")
    );
  }

  // Percentage must not exceed 100
  if (
    this.discountType === "percentage" &&
    this.discountValue > 100
  ) {
    return next(
      new Error("Percentage discount cannot exceed 100%")
    );
  }

  // Fixed discount cannot be negative
  if (
    this.discountType === "fixed" &&
    this.discountValue < 0
  ) {
    return next(
      new Error("Fixed discount cannot be negative")
    );
  }

  // Used count cannot exceed usage limit
  if (
    this.usageLimit > 0 &&
    this.usedCount > this.usageLimit
  ) {
    return next(
      new Error("Used count cannot exceed usage limit")
    );
  }

  next();
});

module.exports = mongoose.model("Coupon", couponSchema);