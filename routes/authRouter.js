import express from "express";
import { validateEmail, validatePassword } from "../middleware/validators.js";
import handleValidationErrors from "../middleware/handleValidationErrors.js";
import {
  registerPost,
  verifyEmail,
  requestNewVerificationEmail,
  emailVerificationExpired,
  verifyEmailSuccess,
  checkIfVerified,
} from "../controllers/authController.js";

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

// Email Auth
router.get("/verify-email", checkIfVerified, verifyEmail);
router.get("/verify-success", verifyEmailSuccess);

/* 
Request new verification email button, fetch new verification email
*/
router.get("/verification-expired", emailVerificationExpired);

/*
Form email input submit button
*/
router.post("/request-new-verification-email", requestNewVerificationEmail);

export default router;
