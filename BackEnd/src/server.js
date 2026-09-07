require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// ======================================================
// Start Server
// ======================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log("=====================================");
      console.log("🚀 Server Running Successfully");
      console.log(`🌐 http://localhost:${PORT}`);
      console.log(
        `📦 Environment : ${
          process.env.NODE_ENV || "development"
        }`
      );
      console.log("=====================================");
    });
  } catch (error) {
    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();