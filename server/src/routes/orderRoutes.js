const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

router.route("/").post(protect, createOrder).get(protect, admin, getAllOrders);
router.get("/my", protect, getMyOrders);
router
  .route("/:id")
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus)
  .delete(protect, admin, deleteOrder);

module.exports = router;
