import express from "express";
import { validateEmail, validatePassword } from "../middleware/validators.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";
import { registerPost, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

// Routes
// Post login user
router.get("/login", (req, res, next) => {
  res.send("Login Page");
});

// Post Register new user
router.post(
  "/register",
  validateEmail,
  validatePassword,
  handleValidationErrors,
  registerPost
);

router.get("/verify-email", verifyEmail);

router.get("/verification-expired", (req, res, next) => {
  res.send("Request new verification");
});

export default router;
