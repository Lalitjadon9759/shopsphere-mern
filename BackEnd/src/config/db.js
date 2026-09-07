const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(
      "❌ Database Error:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;