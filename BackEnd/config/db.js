const mongoose = require("mongoose");

const URL = process.env.DATABASE_URL;

const connectToDb = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = connectToDb;