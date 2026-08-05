const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const upload = require("../middleware/upload");

const {
  getProfile,
  updateProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
} = require("../controllers/user.controller");

// ================= USER ROUTES =================

// Get Logged-in User Profile
router.get("/profile", auth, getProfile);

// Update Profile
router.put(
  "/profile",
  auth,
  upload.single("avatar"),
  updateProfile
);

// Change Password
router.patch(
  "/change-password",
  auth,
  changePassword
);

// ================= ADMIN ROUTES =================

// Get All Users
router.get(
  "/",
  auth,
  roleCheck("admin"),
  getUsers
);

// Get Single User
router.get(
  "/:id",
  auth,
  roleCheck("admin"),
  getUserById
);

// Update User
router.put(
  "/:id",
  auth,
  roleCheck("admin"),
  updateUser
);

// Delete User
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteUser
);

// Block User
router.patch(
  "/:id/block",
  auth,
  roleCheck("admin"),
  blockUser
);

// Unblock User
router.patch(
  "/:id/unblock",
  auth,
  roleCheck("admin"),
  unblockUser
);

module.exports = router;