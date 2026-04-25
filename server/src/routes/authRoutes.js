const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const {
  register,
  login,
  profile,
  allUsers,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);
router.get("/users", protect, admin, allUsers);

module.exports = router;
