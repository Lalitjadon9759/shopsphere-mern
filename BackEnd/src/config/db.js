const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("Database Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;