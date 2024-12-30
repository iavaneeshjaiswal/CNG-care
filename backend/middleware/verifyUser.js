import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
import BlockedToken from "../models/blockedToken.js";

export const verifyUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;
  if (!token)
    return res.status(401).json({ message: "Access Token is required" });
  try {
    // Check if token is blocked
    const checkToken = await BlockedToken.findOne({ token });
    if (checkToken) {
      return res.status(401).json({ message: "Access Token is blocked" });
    }

    // Verify token and specify algorithms
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = user;
    req.user.accessToken = token;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid or expired Access Token" });
  }
};
