const Coupon = require("../models/coupon.model");

// ======================================================
// Helper
// ======================================================

const normalizeCode = (code) => {
  if (!code || typeof code !== "string") {
    return "";
  }

  return code.trim().toUpperCase();
};

// ======================================================
// Create Coupon - Admin
// ======================================================

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumOrderAmount,
      maximumDiscount,
      usageLimit,
      validFrom,
      validTill,
      isActive,
    } = req.body;

    // --------------------------------------------------
    // Validate code
    // --------------------------------------------------

    const normalizedCode = normalizeCode(code);

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    // --------------------------------------------------
    // Validate discount type
    // --------------------------------------------------

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Discount type must be percentage or fixed",
      });
    }

    // --------------------------------------------------
    // Validate discount value
    // --------------------------------------------------

    const discount = Number(discountValue);

    if (!Number.isFinite(discount) || discount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "percentage" && discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // --------------------------------------------------
    // Validate dates
    // --------------------------------------------------

    const startDate = new Date(validFrom);
    const endDate = new Date(validTill);

    if (
      !validFrom ||
      Number.isNaN(startDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid from date is required",
      });
    }

    if (
      !validTill ||
      Number.isNaN(endDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid till date is required",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "Valid till date must be after valid from date",
      });
    }

    // --------------------------------------------------
    // Check duplicate coupon
    // --------------------------------------------------

    const exists = await Coupon.findOne({
      code: normalizedCode,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    // --------------------------------------------------
    // Create coupon
    // --------------------------------------------------

    const coupon = await Coupon.create({
      code: normalizedCode,
      description: description?.trim() || "",
      discountType,
      discountValue: discount,
      minimumOrderAmount:
        Number(minimumOrderAmount) || 0,
      maximumDiscount:
        Number(maximumDiscount) || 0,
      usageLimit:
        Number(usageLimit) || 0,
      usedCount: 0,
      validFrom: startDate,
      validTill: endDate,
      isActive:
        typeof isActive === "boolean"
          ? isActive
          : true,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

// ======================================================
// Get All Coupons - Admin
// ======================================================

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get Coupons Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coupons",
    });
  }
};

// ======================================================
// Get Coupon By ID - Admin
// ======================================================

exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Get Coupon By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch coupon",
    });
  }
};

// ======================================================
// Update Coupon - Admin
// ======================================================

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // --------------------------------------------------
    // Code
    // --------------------------------------------------

    if (req.body.code !== undefined) {
      const normalizedCode = normalizeCode(req.body.code);

      if (!normalizedCode) {
        return res.status(400).json({
          success: false,
          message: "Coupon code cannot be empty",
        });
      }

      const duplicate = await Coupon.findOne({
        code: normalizedCode,
        _id: { $ne: coupon._id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      coupon.code = normalizedCode;
    }

    // --------------------------------------------------
    // Description
    // --------------------------------------------------

    if (req.body.description !== undefined) {
      coupon.description =
        String(req.body.description).trim();
    }

    // --------------------------------------------------
    // Discount Type
    // --------------------------------------------------

    if (req.body.discountType !== undefined) {
      if (
        !["percentage", "fixed"].includes(
          req.body.discountType
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Discount type must be percentage or fixed",
        });
      }

      coupon.discountType = req.body.discountType;
    }

    // --------------------------------------------------
    // Discount Value
    // --------------------------------------------------

    if (req.body.discountValue !== undefined) {
      const discount = Number(req.body.discountValue);

      if (!Number.isFinite(discount) || discount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than 0",
        });
      }

      coupon.discountValue = discount;
    }

    // --------------------------------------------------
    // Validate percentage
    // --------------------------------------------------

    if (
      coupon.discountType === "percentage" &&
      coupon.discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%",
      });
    }

    // --------------------------------------------------
    // Minimum Order Amount
    // --------------------------------------------------

    if (req.body.minimumOrderAmount !== undefined) {
      const value = Number(
        req.body.minimumOrderAmount
      );

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Minimum order amount cannot be negative",
        });
      }

      coupon.minimumOrderAmount = value;
    }

    // --------------------------------------------------
    // Maximum Discount
    // --------------------------------------------------

    if (req.body.maximumDiscount !== undefined) {
      const value = Number(
        req.body.maximumDiscount
      );

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Maximum discount cannot be negative",
        });
      }

      coupon.maximumDiscount = value;
    }

    // --------------------------------------------------
    // Usage Limit
    // --------------------------------------------------

    if (req.body.usageLimit !== undefined) {
      const value = Number(req.body.usageLimit);

      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          success: false,
          message: "Usage limit cannot be negative",
        });
      }

      if (
        value > 0 &&
        coupon.usedCount > value
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Usage limit cannot be less than current usage",
        });
      }

      coupon.usageLimit = value;
    }

    // --------------------------------------------------
    // Valid From
    // --------------------------------------------------

    if (req.body.validFrom !== undefined) {
      const date = new Date(req.body.validFrom);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid valid from date",
        });
      }

      coupon.validFrom = date;
    }

    // --------------------------------------------------
    // Valid Till
    // --------------------------------------------------

    if (req.body.validTill !== undefined) {
      const date = new Date(req.body.validTill);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid valid till date",
        });
      }

      coupon.validTill = date;
    }

    // --------------------------------------------------
    // Validate date range
    // --------------------------------------------------

    if (coupon.validTill <= coupon.validFrom) {
      return res.status(400).json({
        success: false,
        message:
          "Valid till date must be after valid from date",
      });
    }

    // --------------------------------------------------
    // Active Status
    // --------------------------------------------------

    if (req.body.isActive !== undefined) {
      coupon.isActive = Boolean(req.body.isActive);
    }

    // --------------------------------------------------
    // Save
    // --------------------------------------------------

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update coupon",
    });
  }
};

// ======================================================
// Delete Coupon - Admin
// ======================================================

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await coupon.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete coupon",
    });
  }
};

// ======================================================
// Validate Coupon - User
// ======================================================

exports.validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;

    // --------------------------------------------------
    // Validate code
    // --------------------------------------------------

    const normalizedCode = normalizeCode(code);

    if (!normalizedCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    // --------------------------------------------------
    // Validate amount
    // --------------------------------------------------

    const orderAmount = Number(totalAmount);

    if (
      !Number.isFinite(orderAmount) ||
      orderAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid order amount is required",
      });
    }

    // --------------------------------------------------
    // Find coupon
    // --------------------------------------------------

    const coupon = await Coupon.findOne({
      code: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    // --------------------------------------------------
    // Active
    // --------------------------------------------------

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "Coupon is inactive",
      });
    }

    // --------------------------------------------------
    // Date validation
    // --------------------------------------------------

    const now = new Date();

    if (now < coupon.validFrom) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not active yet",
      });
    }

    if (now > coupon.validTill) {
      return res.status(400).json({
        success: false,
        message: "Coupon has expired",
      });
    }

    // --------------------------------------------------
    // Usage limit
    // --------------------------------------------------

    if (
      coupon.usageLimit > 0 &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit reached",
      });
    }

    // --------------------------------------------------
    // Minimum order amount
    // --------------------------------------------------

    if (
      coupon.minimumOrderAmount > 0 &&
      orderAmount < coupon.minimumOrderAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.minimumOrderAmount}`,
      });
    }

    // --------------------------------------------------
    // Calculate discount
    // --------------------------------------------------

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (orderAmount * coupon.discountValue) / 100;

      if (
        coupon.maximumDiscount > 0 &&
        discount > coupon.maximumDiscount
      ) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    // Discount can never exceed order amount
    discount = Math.min(discount, orderAmount);

    // Round to 2 decimals
    discount =
      Math.round(discount * 100) / 100;

    const finalAmount =
      Math.max(orderAmount - discount, 0);

    // --------------------------------------------------
    // Response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",

      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount:
          coupon.minimumOrderAmount,
        maximumDiscount:
          coupon.maximumDiscount,
      },

      discount,

      finalAmount,
    });
  } catch (error) {
    console.error("Validate Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to validate coupon",
    });
  }
};