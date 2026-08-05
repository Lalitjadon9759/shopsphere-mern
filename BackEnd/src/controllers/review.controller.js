const Review = require("../models/review.model");
const Product = require("../models/product.model");

// ======================================================
// Create Review
// ======================================================

exports.createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;

    const productExists = await Product.findById(product);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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

    const review = await Review.create({
      product,
      user: req.user.id,
      rating,
      comment,
    });

    // Update Product Rating
    const reviews = await Review.find({ product });

    const average =
      reviews.reduce((sum, item) => sum + item.rating, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(product, {
      rating: average.toFixed(1),
      totalReviews: reviews.length,
    });

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
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
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Update Review
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

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();

    const reviews = await Review.find({
      product: review.product,
    });

    const average =
      reviews.reduce((sum, item) => sum + item.rating, 0) /
      reviews.length;

    await Product.findByIdAndUpdate(review.product, {
      rating: average.toFixed(1),
      totalReviews: reviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Delete Review
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

    const reviews = await Review.find({
      product: productId,
    });

    let average = 0;

    if (reviews.length > 0) {
      average =
        reviews.reduce((sum, item) => sum + item.rating, 0) /
        reviews.length;
    }

    await Product.findByIdAndUpdate(productId, {
      rating: average.toFixed(1),
      totalReviews: reviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get All Reviews (Admin)
// ======================================================

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Approve / Reject Review (Admin)
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

    review.isApproved = !review.isApproved;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review status updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};