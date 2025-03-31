import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateEmailVerificationToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, process.env.EMAIL_SECRET, { expiresIn: "5m" });
};

export const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    return decoded;
  } catch (err) {
    throw new CustomError(400, "Unable to verify user");
  }
};
