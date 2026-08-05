const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const upload = require("../middleware/upload");

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} = require("../controllers/category.controller");

// Public Routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin Routes
router.post(
  "/",
  auth,
  roleCheck("admin"),
  upload.single("image"),
  createCategory
);

router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  upload.single("image"),
  updateCategory
);

router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteCategory
);

module.exports = router;