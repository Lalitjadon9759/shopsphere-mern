const { body } = require("express-validator");

exports.orderValidation = [
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address required"),

  body("paymentMethod")
    .isIn(["COD", "ONLINE"])
    .withMessage("Invalid payment method"),
];