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

export const validateFolderName = [
  body("folderName")
    .trim()
    .notEmpty()
    .withMessage("Folder name cannot be empty")
    .isLength({ min: 1, max: 255 })
    .withMessage(
      "Folder name must be at least 1 characters long and 255 characters long"
    )
    .matches(/^(?!v\d)[a-zA-Z][a-zA-Z0-9-]*$/)
    .withMessage(
      "Folder name must start with a letter and can only contain letters, numbers, hyphens, and underscores. Cannot start with 'v' followed by a number"
    ),
];
