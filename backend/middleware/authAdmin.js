const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
dotenv.config();
import dotenv from "dotenv";


export default verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded; 
    next();
  });
};
