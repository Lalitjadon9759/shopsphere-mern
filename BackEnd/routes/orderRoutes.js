const express = require("express");

const router = express.Router();

const auth = require("../middleware/authentication");
const rolecheck = require("../middleware/authorization");

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

router.post("/", auth, rolecheck("admin"), createOrder);

router.get("/", auth, rolecheck("admin"), getOrders);

router.get("/:id", auth, getOrderById);

router.patch("/:id", auth, rolecheck("admin"), updateOrder);

router.delete("/:id", auth, rolecheck("admin"), deleteOrder);

module.exports = router;