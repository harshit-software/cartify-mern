const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { register, login, profile } = require("../controllers/authControllers");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, profile);

module.exports = router;
