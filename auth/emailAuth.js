import jwt from "jsonwebtoken";
import CustomError from "../errors/customError.js";
import dotenv from "dotenv";
dotenv.config();

export const generateEmailVerificationToken = (userId) => {
  // Wrapped userId in an object
  const payload = { userId };
  return jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "5m" });
};

export const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    return decoded;
  } catch (err) {
    const error = new CustomError(400, "Unable to verify user");
    error.redirectTo = "http://localhost:8000/api/auth/verification-expired";
    throw error;
  }
};

export const decodeJWTWithoutVerification = (token) => {
  try {
    const decode = jwt.decode(token);
    if (!decode) {
      throw new CustomError(400, "Invalid or missing token");
    }
    return decode;
  } catch (err) {
    throw new CustomError(400, "Failed to decode");
  }
};
