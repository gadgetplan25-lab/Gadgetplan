const { ProductVariant, Color, Storage, Product } = require("../models");

// Get all variants for a product
exports.getProductVariants = async (req, res) => {
    try {
        const { productId } = req.params;

        const variants = await ProductVariant.findAll({
            where: { product_id: productId },
            include: [
                { model: Color, attributes: ['id', 'name'] },
                { model: Storage, attributes: ['id', 'name'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.json({ variants });
    } catch (err) {
        console.error("Error fetching variants:", err);
        res.status(500).json({ message: "Gagal mengambil data variant", error: err.message });
    }
};

// Add variant to product
exports.addVariant = async (req, res) => {
    try {
        const { productId } = req.params;
        const { color_id, storage_id, price, stock, sku } = req.body;

        // Validate product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Check if variant already exists
        const existing = await ProductVariant.findOne({
            where: {
                product_id: productId,
                color_id: color_id || null,
                storage_id: storage_id || null
            }
        });

        if (existing) {
            return res.status(400).json({ message: "Variant dengan kombinasi ini sudah ada" });
        }

        // Create variant
        const variant = await ProductVariant.create({
            product_id: productId,
            color_id: color_id || null,
            storage_id: storage_id || null,
            price,
            stock,
            sku: sku || null
        });

        // Fetch with relations
        const createdVariant = await ProductVariant.findByPk(variant.id, {
            include: [
                { model: Color, attributes: ['id', 'name'] },
                { model: Storage, attributes: ['id', 'name'] }
            ]
        });

        res.status(201).json({
            message: "Variant berhasil ditambahkan",
            variant: createdVariant
        });
    } catch (err) {
        console.error("Error adding variant:", err);
        res.status(500).json({ message: "Gagal menambahkan variant", error: err.message });
    }
};

// Update variant
exports.updateVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const { color_id, storage_id, price, stock, sku } = req.body;

        const variant = await ProductVariant.findByPk(variantId);
        if (!variant) {
            return res.status(404).json({ message: "Variant tidak ditemukan" });
        }

        // Check for duplicate if color/storage changed
        if (color_id !== undefined || storage_id !== undefined) {
            const existing = await ProductVariant.findOne({
                where: {
                    product_id: variant.product_id,
                    color_id: color_id !== undefined ? color_id : variant.color_id,
                    storage_id: storage_id !== undefined ? storage_id : variant.storage_id,
                    id: { [require('sequelize').Op.ne]: variantId }
                }
            });

            if (existing) {
                return res.status(400).json({ message: "Variant dengan kombinasi ini sudah ada" });
            }
        }

        // Update
        await variant.update({
            color_id: color_id !== undefined ? color_id : variant.color_id,
            storage_id: storage_id !== undefined ? storage_id : variant.storage_id,
            price: price !== undefined ? price : variant.price,
            stock: stock !== undefined ? stock : variant.stock,
            sku: sku !== undefined ? sku : variant.sku
        });

        // Fetch updated with relations
        const updated = await ProductVariant.findByPk(variantId, {
            include: [
                { model: Color, attributes: ['id', 'name'] },
                { model: Storage, attributes: ['id', 'name'] }
            ]
        });

        res.json({ message: "Variant berhasil diupdate", variant: updated });
    } catch (err) {
        console.error("Error updating variant:", err);
        res.status(500).json({ message: "Gagal mengupdate variant", error: err.message });
    }
};

// Delete variant
exports.deleteVariant = async (req, res) => {
    try {
        const { variantId } = req.params;

        const variant = await ProductVariant.findByPk(variantId);
        if (!variant) {
            return res.status(404).json({ message: "Variant tidak ditemukan" });
        }

        await variant.destroy();
        res.json({ message: "Variant berhasil dihapus" });
    } catch (err) {
        console.error("Error deleting variant:", err);
        res.status(500).json({ message: "Gagal menghapus variant", error: err.message });
    }
};

// Bulk add variants (untuk kemudahan admin)
exports.bulkAddVariants = async (req, res) => {
    try {
        const { productId } = req.params;
        const { variants } = req.body; // Array of {color_id, storage_id, price, stock}

        // Validate product
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        const created = [];
        const errors = [];

        for (const v of variants) {
            try {
                // Check duplicate
                const existing = await ProductVariant.findOne({
                    where: {
                        product_id: productId,
                        color_id: v.color_id || null,
                        storage_id: v.storage_id || null
                    }
                });

                if (existing) {
                    errors.push({ variant: v, error: "Sudah ada" });
                    continue;
                }

                const variant = await ProductVariant.create({
                    product_id: productId,
                    color_id: v.color_id || null,
                    storage_id: v.storage_id || null,
                    price: v.price,
                    stock: v.stock,
                    sku: v.sku || null
                });

                created.push(variant);
            } catch (err) {
                errors.push({ variant: v, error: err.message });
            }
        }

        res.status(201).json({
            message: `${created.length} variant berhasil ditambahkan`,
            created: created.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (err) {
        console.error("Error bulk adding variants:", err);
        res.status(500).json({ message: "Gagal menambahkan variants", error: err.message });
    }
};
