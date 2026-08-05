require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

// ======================================================
// Connect Database
// ======================================================

connectDB();

// ======================================================
// Start Server
// ======================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`🚀 Server Running Successfully`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`📦 Environment : ${process.env.NODE_ENV}`);
  console.log("=====================================");
});