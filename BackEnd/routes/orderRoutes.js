const express = require("express");
const auth=require("../middleware/authentication")
const rolecheck=require("../middleware/authorization")

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
} = require("../controllers/orderController");

const router = express.Router();

router.post("/",auth,rolecheck, createOrder);

router.get("/",auth,rolecheck, getOrders);

router.get("/:id", auth,getOrderById);

router.patch("/:id",auth,rolecheck, updateOrder);

router.delete("/:id", auth,rolecheck, deleteOrder);

module.exports = router;