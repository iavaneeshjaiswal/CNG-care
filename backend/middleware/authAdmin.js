const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    // Get the user's role from the request
    const userRole = req.user?.role;

    // If the user does not have a role, return an unauthorized response
    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role found" });
    }

    // If the user has one of the required roles, allow them to access the route
    if (requiredRoles.includes(userRole)) {
      return next();
    }

    // If the user does not have one of the required roles, return a forbidden response
    return res
      .status(403)
      .json({ message: "Forbidden: You do not have permission" });
  };
};

export default checkRole;
