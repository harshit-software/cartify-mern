const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { sendEmail } = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check User present in database already or not
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exist " });
    }

    // Password Hashing before Storing Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(10000 + Math.random() * 90000);
    const message = `Welcome to Cartify, ${name}! Your OTP for registration is ${otp}`;
    await sendEmail(email, "Registration OTP for Cartify", message);

    // Saving the User in Database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User Registration Successfully",
      user: {
        id: newUser._id,
        name,
        email,
        role: newUser.role,
        verified: newUser.verified,
      },
      token: generateToken(newUser._id),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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

    const otp = Math.floor(10000 + Math.random() * 90000);
    const message = `Welcome to Cartify, ${isUser.name}! Your OTP for login is ${otp}`;
    await sendEmail(email, "Login OTP for Cartify", message);

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

module.exports = { register, login, profile };
