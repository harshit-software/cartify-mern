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

// router.get("/", showProducts);
// router.get("/:id", showProductById);
// router.post("/", protect, admin, createProduct);
// router.put("/:id", protect, admin, updateProduct);
// router.delete("/:id", protect, admin, deleteProduct);

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
