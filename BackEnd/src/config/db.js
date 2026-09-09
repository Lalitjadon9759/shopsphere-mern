const mongoose = require("mongoose");

const connectDB = async () => {
  try {
console.log("DATABASE_URL starts with:", process.env.DATABASE_URL?.slice(0, 20));

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