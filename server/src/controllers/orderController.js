const Order = require("../models/Order");
const Product = require("../models/Product");
const { sendEmail } = require("../utils/sendEmail");

const createOrder = async (req, res) => {
  try {
    const { product, quantity, amount, address } = req.body;
    if (!product || !quantity || !amount || !address) {
      return res.status().json({
        success: false,
        message: "All Fields Required",
      });
    }

    const order = await Order.create({
      user: req.user.id,
      products: { product, quantity },
      totalAmount: Number(quantity * amount),
      address,
    });

    const messageToSend = `Dear ${req.user.name}, \n\nThank you for your order! Your Order has been successfully created with the following details: \n\n OrderId:${order._id}\n Total Amount: ${amount * quantity}\n Shipping Address: ${address}\n\n We will notify you once your order has been shipped, \n\nBest Regards, \nWith Cartify `;
    await sendEmail(req.user.email, "Order Created", messageToSend);
    res.status(201).json({ message: "Order Created Successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user._id });
    if (order) {
      res
        .status(200)
        .json({ success: true, message: "Order Fetched Successfully", order });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findOne({ _id: orderId });
    if (order) {
      res
        .status(200)
        .json({ success: true, message: "Order Fetched Successfully", order });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const getAllOrders = async (req, res) => {
  try {
    const order = await Order.find({});
    if (order) {
      res
        .status(200)
        .json({ success: true, message: "Order Fetched Successfully", order });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById({ _id: orderId });
    if (order) {
      order.status = "shipped";
      await order.save();
      res.json({
        success: true,
        messgae: "Order Status Updated Successfully",
        order,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete({ _id: orderId });
    res
      .status(200)
      .json({ success: true, message: "Order Deleted Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
