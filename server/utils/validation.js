import { body } from "express-validator";

const validateSignup = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&#]/)
    .withMessage(
      "Password must contain at least one special character (@, $, !, %, *, ?, &, #)"
    ),
];

const validateTransaction = [
  [
    body("amount")
      .isFloat({ min: 1 })
      .withMessage("Amount must be greater than 0."),
    body("category")
      .isIn(["credit", "debit"])
      .withMessage("Category must be either credit or debit."),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long."),
  ],
];

export { validateSignup, validateTransaction };
