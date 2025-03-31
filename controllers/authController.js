import asyncHandler from "express-async-handler";
import CustomError from "../errors/customError.js";
import { createUser, updateUserVerified } from "../services/userService.js";
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
  if (!userId) {
    throw new CustomError(400, "Invalid or expired token");
  }

  // update user in database and change isVerified === true
  const userUpdated = updateUserVerified(userId);

  if (!userUpdated) {
    throw new CustomError(500, "Something went wrong");
  }

  res
    .status(200)
    .json({ success: true, message: "Email successfully verified" });
});
