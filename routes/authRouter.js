import express from "express";
import { validateEmail, validatePassword } from "../middleware/validators.js";
import { handleValidationErrors } from "../middleware/handleValidationErrors.js";
import { registerPost, loginPost } from "../controllers/authController.js";

const router = express.Router();

// Routes
// Post login user
router.post("/login", loginPost);

// Post Register new user
router.post(
  "/register",
  validateEmail,
  validatePassword,
  handleValidationErrors,
  registerPost
);

export default router;
