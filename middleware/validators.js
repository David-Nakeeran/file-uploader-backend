import { body } from "express-validator";

export const validateEmail = [
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Enter a valid email address")
    .notEmpty()
    .withMessage("Email cannot be empty"),
];

export const validatePassword = [
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password should have at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password should have at least one special character")
    .notEmpty()
    .withMessage("Password cannot be empty"),
];
