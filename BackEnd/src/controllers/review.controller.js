const mongoose = require("mongoose");

const Review = require("../models/review.model");
const Product = require("../models/product.model");

// ======================================================
// Helper: Update Product Rating
// ======================================================

const updateProductRating = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    isApproved: true,
  });

  let averageRating = 0;

  if (reviews.length > 0) {
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    averageRating = totalRating / reviews.length;
  }

  await Product.findByIdAndUpdate(productId, {
    rating: Number(averageRating.toFixed(1)),
    totalReviews: reviews.length,
  });
};

// ======================================================
// Create Review
// ======================================================

exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    // Validate product ID
    if (!product || !mongoose.Types.ObjectId.isValid(product)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Validate rating
    if (
      rating === undefined ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Validate comment
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    // Check product
    const productExists = await Product.findById(product);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check duplicate review
    const alreadyReviewed = await Review.findOne({
      product,
      user: req.user.id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      product,
      user: req.user.id,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update product rating
    await updateProductRating(product);

    // Populate user
    await review.populate("user", "name avatar");

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get Product Reviews
// ======================================================

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({
      product: productId,
      isApproved: true,
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Product Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Update Own Review
// ======================================================

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Validate rating if provided
    if (req.body.rating !== undefined) {
      if (
        Number(req.body.rating) < 1 ||
        Number(req.body.rating) > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = Number(req.body.rating);
    }

    // Validate comment if provided
    if (req.body.comment !== undefined) {
      if (!req.body.comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment cannot be empty",
        });
      }

      review.comment = req.body.comment.trim();
    }

    await review.save();

    // Update product rating
    await updateProductRating(review.product);

    // Populate user
    await review.populate("user", "name avatar");

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Delete Own Review
// ======================================================

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const productId = review.product;

    await review.deleteOne();

    // Update product rating
    await updateProductRating(productId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get All Reviews - Admin
// ======================================================

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email avatar")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Approve / Reject Review - Admin
// ======================================================

exports.toggleReviewStatus = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Toggle approval status
    review.isApproved = !review.isApproved;

    await review.save();

    // Recalculate product rating
    await updateProductRating(review.product);

    // Populate user
    await review.populate("user", "name email avatar");

    return res.status(200).json({
      success: true,
      message: review.isApproved
        ? "Review approved successfully"
        : "Review rejected successfully",
      review,
    });
  } catch (error) {
    console.error("Toggle Review Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};