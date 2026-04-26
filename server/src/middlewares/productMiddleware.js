const mongoose = require("mongoose");
const Product = require("../models/Product");

const validateObjectId = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Product Id" });
  }
  next();
};

module.exports = { validateObjectId };
