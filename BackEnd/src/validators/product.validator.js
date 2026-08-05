const { body } = require("express-validator");

exports.productValidation = [
  body("name")
    .notEmpty()
    .withMessage("Product name required"),

  body("price")
    .isNumeric()
    .withMessage("Price must be number"),

  body("stock")
    .isNumeric()
    .withMessage("Stock required"),

  body("category")
    .notEmpty()
    .withMessage("Category required"),
];