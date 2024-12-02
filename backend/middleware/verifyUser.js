import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;



const  verifyUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const id = req.headers.id;
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded; 
    if(decoded.id  != id){
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    next();
  });
};

export default verifyUser;