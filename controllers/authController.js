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
} from "../auth/emailAuth.js";
import { sendVerificationEmail } from "../services/mailService.js";

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

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    throw new CustomError(400, "Invalid or missing token");
  }

  const { userId } = verifyEmailVerificationToken(token);

  const user = await getUserById(userId);

  if (!user.emailVerificationToken) {
    throw new CustomError(400, "This email has already been verified");
  }

  const isTokenValid = await bcrypt.compare(token, user.emailVerificationToken);

  if (!isTokenValid) {
    throw new CustomError(400, "Invalid or expired token");
  }

  const userUpdated = await updateUserVerified(userId);

  if (!userUpdated) {
    throw new CustomError(500, "Internal server error");
  }

  res.status(302).redirect("/verify-success?verified=true");
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

    res
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
