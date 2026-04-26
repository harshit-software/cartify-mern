const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const showProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: {
        count: products.length,
        products,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const showProductById = async (req, res) => {
  try {
    const isProduct = await Product.findById(req.params.id);
    if (!isProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: isProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Validate fields
    if (
      !name ||
      !description ||
      price === undefined ||
      category === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    const productAdd = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: productAdd,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = Number(stock);

    if (req.file) {
      // delete old image
      if (product.image?.public_id) {
        await cloudinary.uploader.destroy(product.image.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });

      product.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
    const updatedProduct = await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product removed successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  showProducts,
  showProductById,
  updateProduct,
  deleteProduct,
};
