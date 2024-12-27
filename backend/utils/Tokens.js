import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Secret keys (use environment variables for production)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// Token expiry times
const ACCESS_TOKEN_EXPIRY = "1d";
const REFRESH_TOKEN_EXPIRY = "15d";

// Middleware to generate tokens
const generateTokens = (user) => {
  console.log(ACCESS_TOKEN_SECRET);
  const accessToken = jwt.sign(
    {
      userId: user._id,
      ...(user.role ? { role: user.role } : { email: user.email }),
    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      ...(user.role ? { role: user.role } : { email: user.email }),
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
  return { accessToken, refreshToken };
};

// Middleware to refresh tokens
const refreshTokens = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh Token is required" });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ message: "Invalid or expired Refresh Token" });

    // Generate new tokens
    const tokens = generateTokens(user);
    res.status(200).json(tokens);
  });
};

export { generateTokens, refreshTokens };
