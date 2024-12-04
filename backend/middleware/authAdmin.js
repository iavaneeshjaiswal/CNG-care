const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role found" });
    }

    if (requiredRoles.includes(userRole)) {
      return next();
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have permission" });
    }
  };
};
export default checkRole;
