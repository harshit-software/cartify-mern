const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");

const { sendEmail } = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000);

    // store temp user data in Redis
    await redis.set(
      `register:${email}`,
      JSON.stringify({
        name,
        email,
        password: hashedPassword,
        role,
      }),
      "EX",
      300,
    );

    await redis.set(`otp:register:${email}`, otp, "EX", 300);

    await sendEmail(email, "Registration OTP", `Your OTP is ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent for registration",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redis.get(`otp:register:${email}`);
    const tempData = await redis.get(`register:${email}`);

    if (!storedOtp || storedOtp !== otp || !tempData) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const userData = JSON.parse(tempData);

    const newUser = await User.create(userData);

    // cleanup
    await redis.del(`otp:register:${email}`);
    await redis.del(`register:${email}`);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        verified: newUser.verified,
      },
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User is present with the email
    const isUser = await User.findOne({ email });
    if (!isUser) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    // Password Checking
    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword) {
      return res.status(500).json({ message: "Invalid Email or Password" });
    }

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      user: {
        id: isUser._id,
        name: isUser.name,
        email,
        role: isUser.role,
        verified: isUser.verified,
      },
      token: generateToken(isUser._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const profile = (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

module.exports = { register, verifyRegister, login, profile };
