const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  register,
  verifyRegister,
  login,
  profile,
} = require("../controllers/authControllers");

router.post("/register", register);
router.post("/verify-register", verifyRegister);
router.post("/login", login);
router.get("/profile", protect, profile);

module.exports = router;
