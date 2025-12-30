const { Wishlist, Product } = require("../models");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { product_id } = req.body;
        const user_id = req.user.id;

        if (!product_id) {
            return res.status(400).json({ message: "Product ID required" });
        }

        // Check if product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            where: { user_id, product_id }
        });

        if (existing) {
            return res.status(400).json({ message: "Produk sudah ada di wishlist" });
        }

        await Wishlist.create({ user_id, product_id });

        res.json({
            success: true,
            message: "Produk ditambahkan ke wishlist"
        });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Gagal menambahkan ke wishlist" });
    }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const deleted = await Wishlist.destroy({
            where: { user_id, product_id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: "Produk tidak ada di wishlist" });
        }

        res.json({
            success: true,
            message: "Produk dihapus dari wishlist"
        });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Gagal menghapus dari wishlist" });
    }
};

// Get user wishlist
exports.getWishlist = async (req, res) => {
    try {
        const user_id = req.user.id;

        const wishlist = await Wishlist.findAll({
            where: { user_id },
            include: [{
                model: Product,
                required: false, // LEFT JOIN instead of INNER JOIN
                attributes: ['id', 'name', 'price', 'stock', 'description']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Map to include images from ProductImages
        const wishlistWithImages = await Promise.all(
            wishlist.map(async (item) => {
                if (item.Product) {
                    const productWithImages = await Product.findByPk(item.Product.id, {
                        include: [{
                            model: require('../models').ProductImage,
                            attributes: ['image_url'],
                            limit: 1
                        }]
                    });

                    if (productWithImages && productWithImages.ProductImages && productWithImages.ProductImages.length > 0) {
                        item.Product.dataValues.images = productWithImages.ProductImages[0].image_url;
                    }
                }
                return item;
            })
        );

        res.json({
            success: true,
            wishlist: wishlistWithImages,
            count: wishlistWithImages.length
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Gagal memuat wishlist",
            error: error.message
        });
    }
};

// Check if product is in wishlist
exports.checkWishlist = async (req, res) => {
    try {
        const { product_id } = req.params;
        const user_id = req.user.id;

        const exists = await Wishlist.findOne({
            where: { user_id, product_id }
        });

        res.json({
            success: true,
            inWishlist: !!exists
        });
    } catch (error) {
        console.error("Error checking wishlist:", error);
        res.status(500).json({ message: "Gagal cek wishlist" });
    }
};
