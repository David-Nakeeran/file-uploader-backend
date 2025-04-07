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
  loginPost,
  refreshTokenController,
  logout,
} from "../controllers/authController.js";
import { authenticateToken, authenticateRefreshToken } from "../auth/auth.js";

const router = express.Router();

// Routes
// Post login user
router.get("/login", (req, res, next) => {
  res.send("Login Page");
});

router.post(
  "/login",
  validateEmail,
  validatePassword,
  handleValidationErrors,
  loginPost
);
router.post("/logout", authenticateToken, logout);

router.get("/protected-route", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Access granted to protected route",
  });
});

router.get("/refresh-token", authenticateRefreshToken, refreshTokenController);

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
