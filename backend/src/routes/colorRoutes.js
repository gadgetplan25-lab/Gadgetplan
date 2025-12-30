const express = require("express");
const router = express.Router();
const colorController = require("../controllers/colorController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin only
router.post("/", verifyToken, isAdmin, colorController.addColor);
router.put("/:id", verifyToken, isAdmin, colorController.updateColor);
router.delete("/:id", verifyToken, isAdmin, colorController.deleteColor);

// Public
router.get("/", colorController.getColors);
router.get("/:id", colorController.getColorById);

module.exports = router;