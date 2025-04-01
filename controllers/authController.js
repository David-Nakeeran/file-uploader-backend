import asyncHandler from "express-async-handler";
import CustomError from "../errors/customError.js";
import {
  createUser,
  updateUserVerified,
  getUserById,
} from "../services/userService.js";
import bcrypt from "bcryptjs";
import { verifyEmailVerificationToken } from "../auth/emailAuth.js";

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

  res.status(302).redirect("api/auth/login?verified=true");
});

export const requestNewVerificationEmail = asyncHandler(
  async (req, res, next) => {}
);
