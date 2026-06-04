export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Bạn không phải là admin" });
  }
  next();
};
