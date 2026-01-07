const express = require("express");
const router = express.Router();
const variantController = require("../controllers/variantController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin routes - manage variants
router.get("/product/:productId", verifyToken, isAdmin, variantController.getProductVariants);
router.post("/product/:productId", verifyToken, isAdmin, variantController.addVariant);
router.post("/product/:productId/bulk", verifyToken, isAdmin, variantController.bulkAddVariants);
router.put("/:variantId", verifyToken, isAdmin, variantController.updateVariant);
router.delete("/:variantId", verifyToken, isAdmin, variantController.deleteVariant);

module.exports = router;
