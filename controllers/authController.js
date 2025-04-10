import asyncHandler from "express-async-handler";
import CustomError from "../errors/customError.js";
import {
  createUser,
  updateUserVerified,
  getUserById,
  getUserByEmail,
  setUserEmailTokenToNull,
  setUserEmailToken,
  setUserRefreshToken,
  setUserRefreshTokenToNull,
} from "../services/userService.js";
import bcrypt from "bcryptjs";
import {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  decodeJWTWithoutVerification,
} from "../auth/emailAuth.js";
import { sendVerificationEmail } from "../services/mailService.js";
import passport from "../auth/passportConfig.js";
import { generateToken } from "../auth/auth.js";
import dotenv from "dotenv";
dotenv.config();

export const registerPost = asyncHandler(async (req, res, next) => {
  //check if user exists

  // if user exists throw custom error 400

  //has password before saving
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  //save user in database
  const newUser = await createUser(req.body, hashedPassword);

  if (!newUser) {
    throw new CustomError(500, "Internal server error");
  }

  res
    .status(201)
    .json({ success: true, message: "User registered successfully" });
});

export const checkIfVerified = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  const { userId } = decodeJWTWithoutVerification(token);

  const user = await getUserById(userId);

  if (user.isVerified) {
    res.status(302).redirect("/api/auth/verify-success?verified=true");
  } else {
    next();
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  const { userId } = verifyEmailVerificationToken(token);

  const user = await getUserById(userId);

  const isTokenValid = await bcrypt.compare(token, user.emailVerificationToken);

  if (!isTokenValid) {
    throw new CustomError(400, "Invalid or expired token");
  }

  const userUpdated = await updateUserVerified(userId);

  if (!userUpdated) {
    throw new CustomError(500, "Internal server error");
  }

  res.status(302).redirect("/api/auth/verify-success?verified=true");
});

export const emailVerificationExpired = asyncHandler(async (req, res, next) => {
  res.json({
    message: "Your verification link has expired. Please request a new one",
  });
});

export const requestNewVerificationEmail = asyncHandler(
  async (req, res, next) => {
    const user = await getUserByEmail(req.body);

    // check if user has been verified already
    if (user.isVerified) {
      return res
        .status(200)
        .json({ success: true, message: "User already verified" });
    }

    // check if user has emailVerificationToken, if so, delete
    const updatedUser = user.emailVerificationToken
      ? await setUserEmailTokenToNull(user)
      : user;

    const verificationToken = generateEmailVerificationToken(updatedUser.id);

    const hashedToken = await bcrypt.hash(verificationToken, 10);

    await setUserEmailToken(updatedUser, hashedToken);

    await sendVerificationEmail(updatedUser.email, verificationToken);

    return res
      .status(200)
      .json({ success: true, message: "New verification email sent to user" });
  }
);

export const verifyEmailSuccess = asyncHandler(async (req, res, next) => {
  const { verified } = req.query;

  if (verified === "true") {
    return res.status(200).json({
      success: true,
      message: "Your email has been successfully verified",
    });
  }

  throw new CustomError(400, "Verification failed");
});

export const loginPost = (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        throw new CustomError(400, info?.message || "An error occurred");
      }

      const accessToken = generateToken(user, process.env.TOKEN_SECRET, "15m");
      const refreshToken = generateToken(
        user,
        process.env.REFRESH_TOKEN_SECRET,
        "24h"
      );

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await setUserRefreshToken(user, hashedRefreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        // secure: true // Set to true for HTTPS connections only
        sameSite: "Strict",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        // secure: true // Set to true for HTTPS connections only
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};

export const refreshTokenController = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  const user = await getUserById(req.user);

  const match = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!match) {
    throw new CustomError(401, "Refresh token does not match");
  }

  const newAccessToken = generateToken(user, process.env.TOKEN_SECRET, "15m");

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    // secure: true // Set to true for HTTPS connections only
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  return res
    .status(200)
    .json({ success: true, message: "Access token refreshed" });
});

export const logout = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  if (!userId) {
    throw new CustomError(401, "Logout failed");
  }
  await setUserRefreshTokenToNull(userId);

  res.clearCookie("accessToken", {
    httpOnly: true,
    // secure: true // Set to true for HTTPS connections only
    sameSite: "Strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    // secure: true // Set to true for HTTPS connections only
    sameSite: "Strict",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
