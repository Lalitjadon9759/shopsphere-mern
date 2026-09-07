const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Review = require("../models/review.model");

// ======================================================
// CATEGORIES
// ======================================================

const categories = [
  {
    name: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800",
  },
  {
    name: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
  },
  {
    name: "Home & Kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
  },
  {
    name: "Sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
  },
  {
    name: "Beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
  },
  {
    name: "Books",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
  },
  {
    name: "Toys",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800",
  },
  {
    name: "Grocery",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
  },
  {
    name: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  },
  {
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
  },
  {
    name: "Furniture",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
  },
  {
    name: "Automotive",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800",
  },
];

// ======================================================
// PRODUCTS
// ======================================================

const productsData = [
  // ================= ELECTRONICS =================

  {
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    category: "Electronics",
    description:
      "High-quality wireless headphones with deep bass and comfortable ear cushions.",
    brand: "SoundMax",
    price: 2999,
    discountPrice: 2499,
    stock: 50,
    images: [
      {
        public_id: "seed-headphones-1",
        url:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000",
      },
      {
        public_id: "seed-headphones-2",
        url:
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Smart Watch",
    slug: "smart-watch",
    category: "Electronics",
    description:
      "Modern smart watch with fitness tracking, heart rate monitoring and notifications.",
    brand: "TechTime",
    price: 4999,
    discountPrice: 3999,
    stock: 30,
    images: [
      {
        public_id: "seed-watch-1",
        url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000",
      },
      {
        public_id: "seed-watch-2",
        url:
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Bluetooth Speaker",
    slug: "bluetooth-speaker",
    category: "Electronics",
    description:
      "Portable Bluetooth speaker with powerful sound and long battery life.",
    brand: "SoundMax",
    price: 2499,
    discountPrice: 1999,
    stock: 45,
    images: [
      {
        public_id: "seed-speaker-1",
        url:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1000",
      },
      {
        public_id: "seed-speaker-2",
        url:
          "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Mechanical Keyboard",
    slug: "mechanical-keyboard",
    category: "Electronics",
    description:
      "RGB mechanical keyboard designed for gaming and productivity.",
    brand: "KeyPro",
    price: 3499,
    discountPrice: 2999,
    stock: 35,
    images: [
      {
        public_id: "seed-keyboard-1",
        url:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  {
    name: "Wireless Mouse",
    slug: "wireless-mouse",
    category: "Electronics",
    description:
      "Ergonomic wireless mouse with accurate tracking and comfortable grip.",
    brand: "TechGear",
    price: 1499,
    discountPrice: 999,
    stock: 80,
    images: [
      {
        public_id: "seed-mouse-1",
        url:
          "https://images.unsplash.com/photo-1527814050087-3793815479db?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= FASHION =================

  {
    name: "Men's Casual T-Shirt",
    slug: "mens-casual-tshirt",
    category: "Fashion",
    description:
      "Comfortable cotton casual t-shirt suitable for everyday wear.",
    brand: "UrbanWear",
    price: 999,
    discountPrice: 699,
    stock: 100,
    images: [
      {
        public_id: "seed-tshirt-1",
        url:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000",
      },
      {
        public_id: "seed-tshirt-2",
        url:
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Women's Summer Dress",
    slug: "womens-summer-dress",
    category: "Fashion",
    description:
      "Elegant and comfortable summer dress suitable for casual occasions.",
    brand: "StyleHub",
    price: 1999,
    discountPrice: 1499,
    stock: 60,
    images: [
      {
        public_id: "seed-dress-1",
        url:
          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Denim Jacket",
    slug: "denim-jacket",
    category: "Fashion",
    description:
      "Classic denim jacket with modern styling for everyday outfits.",
    brand: "UrbanWear",
    price: 2999,
    discountPrice: 2199,
    stock: 40,
    images: [
      {
        public_id: "seed-jacket-1",
        url:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  {
    name: "Classic Hoodie",
    slug: "classic-hoodie",
    category: "Fashion",
    description:
      "Warm and comfortable hoodie for casual everyday wear.",
    brand: "StreetStyle",
    price: 1799,
    discountPrice: 1299,
    stock: 75,
    images: [
      {
        public_id: "seed-hoodie-1",
        url:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= FOOTWEAR =================

  {
    name: "Running Shoes",
    slug: "running-shoes",
    category: "Footwear",
    description:
      "Lightweight running shoes designed for comfort and daily workouts.",
    brand: "RunPro",
    price: 3499,
    discountPrice: 2999,
    stock: 40,
    images: [
      {
        public_id: "seed-shoes-1",
        url:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000",
      },
      {
        public_id: "seed-shoes-2",
        url:
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Casual Sneakers",
    slug: "casual-sneakers",
    category: "Footwear",
    description:
      "Stylish casual sneakers designed for everyday comfort.",
    brand: "StreetStep",
    price: 2999,
    discountPrice: 2399,
    stock: 55,
    images: [
      {
        public_id: "seed-sneakers-1",
        url:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  // ================= HOME & KITCHEN =================

  {
    name: "Kitchen Mixer",
    slug: "kitchen-mixer",
    category: "Home & Kitchen",
    description:
      "Powerful kitchen mixer for baking, cooking and everyday food preparation.",
    brand: "HomeChef",
    price: 5999,
    discountPrice: 4999,
    stock: 20,
    images: [
      {
        public_id: "seed-mixer-1",
        url:
          "https://images.unsplash.com/photo-1578643463396-0997cb5328a1?w=1000",
      },
      {
        public_id: "seed-mixer-2",
        url:
          "https://images.unsplash.com/photo-1585515320310-259814833e62?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Modern Coffee Maker",
    slug: "modern-coffee-maker",
    category: "Home & Kitchen",
    description:
      "Modern coffee maker for preparing delicious coffee at home.",
    brand: "HomeBrew",
    price: 4499,
    discountPrice: 3699,
    stock: 25,
    images: [
      {
        public_id: "seed-coffee-1",
        url:
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Non Stick Cookware Set",
    slug: "non-stick-cookware-set",
    category: "Home & Kitchen",
    description:
      "Premium non-stick cookware set for everyday cooking.",
    brand: "KitchenPro",
    price: 4999,
    discountPrice: 3999,
    stock: 30,
    images: [
      {
        public_id: "seed-cookware-1",
        url:
          "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= SPORTS =================

  {
    name: "Yoga Mat",
    slug: "yoga-mat",
    category: "Sports",
    description:
      "Comfortable non-slip yoga mat for home workouts and yoga sessions.",
    brand: "FitLife",
    price: 1299,
    discountPrice: 899,
    stock: 70,
    images: [
      {
        public_id: "seed-yoga-1",
        url:
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Football",
    slug: "football",
    category: "Sports",
    description:
      "Durable football suitable for training and recreational games.",
    brand: "SportMax",
    price: 999,
    discountPrice: 799,
    stock: 50,
    images: [
      {
        public_id: "seed-football-1",
        url:
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  {
    name: "Dumbbell Set",
    slug: "dumbbell-set",
    category: "Sports",
    description:
      "Adjustable dumbbell set for strength training at home.",
    brand: "FitLife",
    price: 3999,
    discountPrice: 3299,
    stock: 25,
    images: [
      {
        public_id: "seed-dumbbell-1",
        url:
          "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  // ================= BEAUTY =================

  {
    name: "Skincare Gift Set",
    slug: "skincare-gift-set",
    category: "Beauty",
    description:
      "Complete skincare gift set for daily beauty and skincare routines.",
    brand: "GlowCare",
    price: 1999,
    discountPrice: 1499,
    stock: 45,
    images: [
      {
        public_id: "seed-skincare-1",
        url:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Perfume",
    slug: "premium-perfume",
    category: "Beauty",
    description:
      "Premium long-lasting fragrance for everyday and special occasions.",
    brand: "AromaLux",
    price: 2999,
    discountPrice: 2299,
    stock: 35,
    images: [
      {
        public_id: "seed-perfume-1",
        url:
          "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  // ================= BOOKS =================

  {
    name: "The Psychology of Money",
    slug: "psychology-of-money",
    category: "Books",
    description:
      "A popular book about money, investing and financial behavior.",
    brand: "Penguin",
    price: 599,
    discountPrice: 449,
    stock: 100,
    images: [
      {
        public_id: "seed-book-1",
        url:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "JavaScript Programming Guide",
    slug: "javascript-programming-guide",
    category: "Books",
    description:
      "Complete guide to learning modern JavaScript programming.",
    brand: "TechBooks",
    price: 899,
    discountPrice: 699,
    stock: 60,
    images: [
      {
        public_id: "seed-js-book-1",
        url:
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= TOYS =================

  {
    name: "Remote Control Car",
    slug: "remote-control-car",
    category: "Toys",
    description:
      "Fast remote control car for kids and hobby enthusiasts.",
    brand: "FunToy",
    price: 1999,
    discountPrice: 1499,
    stock: 40,
    images: [
      {
        public_id: "seed-rc-car-1",
        url:
          "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Building Blocks",
    slug: "building-blocks",
    category: "Toys",
    description:
      "Creative building block set for children's learning and entertainment.",
    brand: "BuildKids",
    price: 1299,
    discountPrice: 999,
    stock: 80,
    images: [
      {
        public_id: "seed-blocks-1",
        url:
          "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= GROCERY =================

  {
    name: "Organic Honey",
    slug: "organic-honey",
    category: "Grocery",
    description:
      "Natural organic honey suitable for daily consumption.",
    brand: "NaturePure",
    price: 499,
    discountPrice: 399,
    stock: 100,
    images: [
      {
        public_id: "seed-honey-1",
        url:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Premium Coffee Beans",
    slug: "premium-coffee-beans",
    category: "Grocery",
    description:
      "Fresh premium coffee beans with rich aroma and flavor.",
    brand: "BeanHouse",
    price: 799,
    discountPrice: 649,
    stock: 75,
    images: [
      {
        public_id: "seed-coffee-beans-1",
        url:
          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  // ================= ACCESSORIES =================

  {
    name: "Classic Wrist Watch",
    slug: "classic-wrist-watch",
    category: "Accessories",
    description:
      "Elegant wrist watch suitable for formal and casual occasions.",
    brand: "TimePro",
    price: 2499,
    discountPrice: 1999,
    stock: 35,
    images: [
      {
        public_id: "seed-classic-watch-1",
        url:
          "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Leather Wallet",
    slug: "leather-wallet",
    category: "Accessories",
    description:
      "Premium leather wallet with multiple card and cash compartments.",
    brand: "LeatherCraft",
    price: 1499,
    discountPrice: 1099,
    stock: 60,
    images: [
      {
        public_id: "seed-wallet-1",
        url:
          "https://images.unsplash.com/photo-1627123424574-724758594e93?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= FURNITURE =================

  {
    name: "Modern Sofa",
    slug: "modern-sofa",
    category: "Furniture",
    description:
      "Comfortable modern sofa designed for contemporary living rooms.",
    brand: "HomeStyle",
    price: 24999,
    discountPrice: 19999,
    stock: 10,
    images: [
      {
        public_id: "seed-sofa-1",
        url:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Wooden Study Table",
    slug: "wooden-study-table",
    category: "Furniture",
    description:
      "Minimal wooden study table for home office and study rooms.",
    brand: "WoodCraft",
    price: 8999,
    discountPrice: 7499,
    stock: 15,
    images: [
      {
        public_id: "seed-table-1",
        url:
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },

  // ================= AUTOMOTIVE =================

  {
    name: "Car Cleaning Kit",
    slug: "car-cleaning-kit",
    category: "Automotive",
    description:
      "Complete car cleaning kit for keeping your vehicle clean and polished.",
    brand: "AutoCare",
    price: 1499,
    discountPrice: 1099,
    stock: 50,
    images: [
      {
        public_id: "seed-car-kit-1",
        url:
          "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=1000",
      },
    ],
    featured: true,
    isActive: true,
  },

  {
    name: "Car Phone Holder",
    slug: "car-phone-holder",
    category: "Automotive",
    description:
      "Adjustable car phone holder with strong dashboard mounting.",
    brand: "AutoGear",
    price: 899,
    discountPrice: 699,
    stock: 80,
    images: [
      {
        public_id: "seed-phone-holder-1",
        url:
          "https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1000",
      },
    ],
    featured: false,
    isActive: true,
  },
];

// ======================================================
// SEED DATABASE
// ======================================================

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("=====================================");
    console.log("MongoDB Connected");
    console.log("=====================================");

    // ==================================================
    // CLEAR DATABASE
    // ==================================================

    await Review.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log("Existing data cleared");

    // ==================================================
    // CREATE CATEGORIES
    // ==================================================

    const createdCategories = await Category.insertMany(categories);

    console.log(`${createdCategories.length} categories created`);

    // ==================================================
    // CREATE CATEGORY MAP
    // ==================================================

    const categoryMap = {};

    createdCategories.forEach((category) => {
      categoryMap[category.name] = category._id;
    });

    console.log("Category map created");

    // ==================================================
    // VALIDATE PRODUCTS
    // ==================================================

    for (const product of productsData) {
      if (!categoryMap[product.category]) {
        throw new Error(
          `Category "${product.category}" does not exist for product "${product.name}"`
        );
      }
    }

    // ==================================================
    // PREPARE PRODUCTS
    // ==================================================

    const products = productsData.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));

    // ==================================================
    // CREATE PRODUCTS
    // ==================================================

    const createdProducts = await Product.insertMany(products);

    console.log(`${createdProducts.length} products created`);

    // ==================================================
    // CREATE USERS
    // ==================================================

    const hashedPassword = await bcrypt.hash("123456", 10);

    const normalUser = await User.create({
      name: "ShopSphere User",
      email: "user@shopsphere.com",
      password: hashedPassword,
      phone: "9876543210",
      role: "user",
      isBlocked: false,
    });

    console.log(`User created: ${normalUser.email}`);

    const adminUser = await User.create({
      name: "ShopSphere Admin",
      email: "admin@shopsphere.com",
      password: hashedPassword,
      phone: "9876543211",
      role: "admin",
      isBlocked: false,
    });

    console.log(`Admin created: ${adminUser.email}`);

    // ==================================================
    // SAMPLE REVIEWS
    // ==================================================

    const reviewProducts = createdProducts.slice(0, 5);

    for (const product of reviewProducts) {
      await Review.create({
        product: product._id,
        user: normalUser._id,
        rating: 5,
        comment: `Excellent ${product.name}. Highly recommended!`,
        isApproved: true,
      });

      await Product.findByIdAndUpdate(product._id, {
        rating: 5,
        totalReviews: 1,
      });
    }

    console.log(`${reviewProducts.length} reviews created`);

    // ==================================================
    // FINAL OUTPUT
    // ==================================================

    console.log("");
    console.log("=====================================");
    console.log("🚀 SHOPSPHERE DATABASE SEEDED");
    console.log("=====================================");

    console.log("");
    console.log(`Categories : ${createdCategories.length}`);
    console.log(`Products   : ${createdProducts.length}`);
    console.log(`Users      : 2`);
    console.log(`Reviews    : ${reviewProducts.length}`);

    console.log("");
    console.log("USER LOGIN");
    console.log("-------------------------------------");
    console.log("Email    : user@shopsphere.com");
    console.log("Password : 123456");

    console.log("");
    console.log("ADMIN LOGIN");
    console.log("-------------------------------------");
    console.log("Email    : admin@shopsphere.com");
    console.log("Password : 123456");

    console.log("");
    console.log("=====================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ Seed failed");
    console.error(error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();