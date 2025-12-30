const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const wishlistController = require("../controllers/wishlistController");
const reviewController = require("../controllers/reviewController");

// ============================================
// WISHLIST ROUTES
// ============================================

// Add to wishlist
router.post("/wishlist", verifyToken, wishlistController.addToWishlist);

// Remove from wishlist
router.delete("/wishlist/:product_id", verifyToken, wishlistController.removeFromWishlist);

// Get user wishlist
router.get("/wishlist", verifyToken, wishlistController.getWishlist);

// Check if product in wishlist
router.get("/wishlist/check/:product_id", verifyToken, wishlistController.checkWishlist);

// ============================================
// PRODUCT REVIEW ROUTES
// ============================================

// Create review
router.post("/reviews", verifyToken, reviewController.createReview);

// Get product reviews (public)
router.get("/reviews/product/:productId", reviewController.getProductReviews);

// Get user's reviews
router.get("/reviews/my-reviews", verifyToken, reviewController.getUserReviews);

// Update review
router.put("/reviews/:id", verifyToken, reviewController.updateReview);

// Delete review
router.delete("/reviews/:id", verifyToken, reviewController.deleteReview);

module.exports = router;
