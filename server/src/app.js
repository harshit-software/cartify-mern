const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
connectToDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Ecommerce Backend Homepage");
});

module.exports = app;
