const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { allUsers, getAdminStats } = require("../controllers/adminController");

router.get("/", protect, admin, getAdminStats);
router.get("/users", protect, admin, allUsers);

module.exports = router;
