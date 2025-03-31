import express from "express";
import { validateEmail, validatePassword } from "../middleware/validators.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";
import { registerPost, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

// Routes
// Post login user
// router.post("/login", loginPost);

// Post Register new user
router.post(
  "/register",
  validateEmail,
  validatePassword,
  handleValidationErrors,
  registerPost
);

router.post("/verify-email", verifyEmail);

export default router;
