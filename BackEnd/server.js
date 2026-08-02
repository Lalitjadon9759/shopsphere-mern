const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const connectToDb = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

connectToDb();

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});