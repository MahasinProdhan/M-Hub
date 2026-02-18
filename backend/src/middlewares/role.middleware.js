export const requireRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!req.user || !userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
