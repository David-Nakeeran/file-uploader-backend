import jwt from "jsonwebtoken";
import CustomError from "../errors/customError.js";
import dotenv from "dotenv";
dotenv.config();

// export const generateToken = (user, secret, expires) => {
//   const payload = { userId: user.id };
//   return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "5m" });
// };

export const generateToken = (user, secret, expires) => {
  const payload = { userId: user.id };
  return jwt.sign(payload, secret, { expiresIn: expires });
};

export const authenticateToken = (req, res, next) => {
  // Extract access token from the HttpOnly cookie
  console.log(req.cookies);
  const token = req.cookies.accessToken;

  if (!token) {
    throw new CustomError(401, "Access denied, no token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    throw new CustomError(401, "Invalid or expired token");
    // if token expires, frontend re-directs to login
  }
};

export const authenticateRefreshToken = (req, res, next) => {
  // Extract access token from the HttpOnly cookie
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new CustomError(401, "No refresh token provided");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    throw new CustomError(401, "Invalid or expired token");
    // if token expires, frontend re-directs to login
  }
};
