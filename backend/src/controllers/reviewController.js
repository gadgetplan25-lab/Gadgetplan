const { ProductReview, Product, User, Order } = require("../models");
const { Op } = require("sequelize");

// Create review
exports.createReview = async (req, res) => {
    try {
        const { product_id, order_id, rating, review } = req.body;
        const user_id = req.user.id;

        // Validation
        if (!product_id || !rating) {
            return res.status(400).json({ message: "Product ID dan rating wajib diisi" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating harus antara 1-5" });
        }

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Check if user already reviewed this product for this order
        const existing = await ProductReview.findOne({
            where: {
                user_id,
                product_id,
                ...(order_id && { order_id })
            }
        });

        if (existing) {
            return res.status(400).json({
                message: "Anda sudah memberikan review untuk produk ini"
            });
        }

        // If order_id provided, verify user owns the order
        if (order_id) {
            const order = await Order.findOne({
                where: { id: order_id, user_id }
            });

            if (!order) {
                return res.status(403).json({
                    message: "Order tidak ditemukan atau bukan milik Anda"
                });
            }
        }

        const newReview = await ProductReview.create({
            product_id,
            user_id,
            order_id: order_id || null,
            rating,
            review: review || null
        });

        res.status(201).json({
            success: true,
            message: "Review berhasil ditambahkan",
            review: newReview
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Gagal menambahkan review" });
    }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows: reviews } = await ProductReview.findAndCountAll({
            where: { product_id: productId },
            include: [{
                model: User,
                attributes: ['id', 'name']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate average rating
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        // Rating distribution
        const ratingDistribution = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length,
        };

        res.json({
            success: true,
            reviews,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            },
            stats: {
                averageRating: parseFloat(avgRating.toFixed(1)),
                totalReviews: count,
                ratingDistribution
            }
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Gagal memuat review" });
    }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
    try {
        const user_id = req.user.id;

        const reviews = await ProductReview.findAll({
            where: { user_id },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'images']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            reviews,
            count: reviews.length
        });
    } catch (error) {
        console.error("Error fetching user reviews:", error);
        res.status(500).json({ message: "Gagal memuat review Anda" });
    }
};

// Update review
exports.updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, review } = req.body;
        const user_id = req.user.id;

        const existingReview = await ProductReview.findOne({
            where: { id, user_id }
        });

        if (!existingReview) {
            return res.status(404).json({
                message: "Review tidak ditemukan atau bukan milik Anda"
            });
        }

        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ message: "Rating harus antara 1-5" });
        }

        await existingReview.update({
            ...(rating && { rating }),
            ...(review !== undefined && { review })
        });

        res.json({
            success: true,
            message: "Review berhasil diupdate",
            review: existingReview
        });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ message: "Gagal update review" });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const deleted = await ProductReview.destroy({
            where: { id, user_id }
        });

        if (deleted === 0) {
            return res.status(404).json({
                message: "Review tidak ditemukan atau bukan milik Anda"
            });
        }

        res.json({
            success: true,
            message: "Review berhasil dihapus"
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: "Gagal menghapus review" });
    }
};
