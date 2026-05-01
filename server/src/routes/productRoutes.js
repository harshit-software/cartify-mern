const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { validateObjectId } = require("../middlewares/productMiddleware");
const {
  showProducts,
  showProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middlewares/uploadImage");

router
  .route("/")
  .get(showProducts)
  .post(protect, admin, upload.single("image"), createProduct);
router
  .route("/:id")
  .get(validateObjectId, showProductById)
  .put(validateObjectId, protect, admin, upload.single("image"), updateProduct)
  .delete(validateObjectId, protect, admin, deleteProduct);

module.exports = router;
