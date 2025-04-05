import asyncHandler from "express-async-handler";
import CustomError from "../errors/customError.js";
import {
  createUser,
  updateUserVerified,
  getUserById,
  getUserByEmail,
  setUserEmailTokenToNull,
  setUserEmailToken,
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
      console.log("Are we here");
      if (err || !user) {
        throw new CustomError(400, info?.message || "An error occurred");
      }

      const token = generateToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        // secure: true // Set to true for HTTPS connections only
        sameSite: "Strict",
        maxAge: 5 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        // token: token,
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
};
