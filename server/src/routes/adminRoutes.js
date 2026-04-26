const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { allUsers } = require("../controllers/adminController");

router.get("/users", protect, admin, allUsers);

module.exports = router;
