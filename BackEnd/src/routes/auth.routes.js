const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validation");
const auth = require("../middleware/auth");

const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

// Profile
router.get(
  "/profile",
  auth,
  authController.profile
);

module.exports = router;