const admin = (req, res, next) => {
  const { role } = req.user;
  if (role === "admin") {
    next();
  } else {
    return res
      .status(404)
      .json({ success: false, message: "Access Denied, For Admin Only" });
  }
};

module.exports = { admin };
