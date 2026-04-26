const User = require("../models/User");
const allUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (users.length === 0) {
      return res
        .status(400)
        .json({ message: "No User or Admin is Registered" });
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { allUsers };
