const Product = require("../models/product.model");
const Category = require("../models/category.model");
const slugify = require("slugify");

// ======================================================
// Create Product
// ======================================================

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
      featured,
    } = req.body;

    // Validate Category
    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check duplicate product
    const exists = await Product.findOne({
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already exists",
      });
    }

    // Upload Images
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
      }));
    }

    // Create Product
    const product = await Product.create({
      name,
      slug: slugify(name, {
        lower: true,
        strict: true,
      }),
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
      featured,
      images,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name image");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// Update Product
// ======================================================

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
      featured,
      isActive,
    } = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate category if changed
    if (category) {
      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      product.category = category;
    }

    // Update slug if name changes
    if (name) {
      const slug = slugify(name, {
        lower: true,
        strict: true,
      });

      const duplicate = await Product.findOne({
        slug,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Product name already exists",
        });
      }

      product.name = name;
      product.slug = slug;
    }

    if (description !== undefined)
      product.description = description;

    if (brand !== undefined)
      product.brand = brand;

    if (price !== undefined)
      product.price = price;

    if (discountPrice !== undefined)
      product.discountPrice = discountPrice;

    if (stock !== undefined)
      product.stock = stock;

    if (featured !== undefined)
      product.featured = featured;

    if (isActive !== undefined)
      product.isActive = isActive;

    // Replace images if new images uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
      }));
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name image");

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Delete Product
// ======================================================

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Hard Delete
    await product.deleteOne();

    // If you prefer soft delete instead, replace the above with:
    // product.isActive = false;
    // await product.save();

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// Get All Products
// Pagination + Search + Filter + Sorting
// ======================================================

exports.getProducts = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      featured,
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      isActive: true,
    };

    // Search by name
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Featured products
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Sorting
    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;

      case "price_desc":
        sortOption = { price: -1 };
        break;

      case "latest":
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "name":
        sortOption = { name: 1 };
        break;

      default:
        sortOption = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name image")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,

      currentPage: page,

      totalPages: Math.ceil(totalProducts / limit),

      totalProducts,

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
// Get Product By Slug
// ======================================================

exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      isActive: true,
    }).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Get Featured Products
// ======================================================

exports.getFeaturedProducts = async (req, res) => {
  try {

    const limit = Number(req.query.limit) || 8;

    const products = await Product.find({
      featured: true,
      isActive: true,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(limit);

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
// Get Related Products
// ======================================================

exports.getRelatedProducts = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    })
      .populate("category", "name")
      .limit(4);

    return res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};