import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

/**
 * Middleware to verify user authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const verifyUser = (req, res, next) => {
  // Retrieve token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token using the secret key
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // Handle specific token errors
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      // For other errors, return 403 Forbidden
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    // Attach decoded token information to the request object
    req.user = decoded;
    // Proceed to the next middleware
    next();
  });
};

