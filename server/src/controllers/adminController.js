const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const allUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
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

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});
    const orders = await Order.find({});

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0,
    );

    res.status(200).json({
      success: true,
      message: "Admin stats fetched successfully",
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { allUsers, getAdminStats };
