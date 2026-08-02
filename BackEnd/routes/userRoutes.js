const express = require("express");

const router = express.Router();

const auth = require("../middleware/authentication");
const rolecheck = require("../middleware/authorization");

const {
    createUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");

router.get("/", auth, getUser);

router.get("/:id", auth, getUserById);

router.post("/", auth, createUser);

router.patch("/:id", auth, rolecheck("admin"), updateUser);

router.delete("/:id", auth, rolecheck("admin"), deleteUser);

module.exports = router;