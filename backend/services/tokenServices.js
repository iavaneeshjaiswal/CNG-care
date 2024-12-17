import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateTokenAdmin = (admin) => {
  return jwt.sign(
    {
      _id: admin._id,
      username: admin.username,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const generateTokenUser = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

const verifyToken = (token) => {
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(403).json({ message: "Failed to authenticate token" });
    }
    return decoded;
  });
};

export default { generateTokenAdmin, verifyToken, generateTokenUser };
