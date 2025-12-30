const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const uploadBlog = require("../middleware/uploadBlog");

// Admin
router.post("/", verifyToken, isAdmin, uploadBlog, blogController.addBlog);
router.put("/:id", verifyToken, isAdmin, uploadBlog, blogController.updateBlog);
router.delete("/:id", verifyToken, isAdmin, blogController.deleteBlog);

// Public
router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlogBySlug);

module.exports = router;