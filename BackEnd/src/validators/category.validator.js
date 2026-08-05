const { body } = require("express-validator");

exports.categoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Category name required"),
];