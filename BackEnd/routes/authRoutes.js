const express = require("express");
const authrouter = express.Router();

const { register, login } = require("../controllers/authcontroller");
      
authrouter.post("/register", register);

authrouter.post("/login", login);

module.exports = authrouter;












