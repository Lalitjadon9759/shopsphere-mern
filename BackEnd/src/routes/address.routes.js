const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/address.controller");

// ======================================================
// USER ADDRESS ROUTES
// ======================================================

// Create Address
router.post(
  "/",
  auth,
  createAddress
);

// Get All Addresses
router.get(
  "/",
  auth,
  getAddresses
);

// Get Single Address
router.get(
  "/:id",
  auth,
  getAddressById
);

// Update Address
router.put(
  "/:id",
  auth,
  updateAddress
);

// Delete Address
router.delete(
  "/:id",
  auth,
  deleteAddress
);

// Set Default Address
router.patch(
  "/:id/default",
  auth,
  setDefaultAddress
);

module.exports = router;