import jwt from "jsonwebtoken";
import CustomError from "../errors/customError.js";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
  const payload = { userId: user.id };
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "5m" });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(req.headers);
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new CustomError(401, "Access denied, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    throw new CustomError(403, "Invalid or expired token");
    // if token expires, frontend re-directs to login
  }
};
