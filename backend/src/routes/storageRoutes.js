const express = require("express");
const router = express.Router();
const storageController = require("../controllers/storageController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Admin only
router.post("/", verifyToken, isAdmin, storageController.addStorage);
router.put("/:id", verifyToken, isAdmin, storageController.updateStorage);
router.delete("/:id", verifyToken, isAdmin, storageController.deleteStorage);

// Public
router.get("/", storageController.getStorages);
router.get("/:id", storageController.getStorageById);

module.exports = router;