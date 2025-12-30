const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");


router.post("/", verifyToken, isAdmin, tagController.createTag);
router.put("/:id", verifyToken, isAdmin, tagController.updateTag);
router.delete("/:id", verifyToken, isAdmin, tagController.deleteTag);


// Public
router.get("/", tagController.getAllTags);
router.get("/:id", tagController.getTagById);

module.exports = router;