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

// ✅ UPDATED: Add variant to product with auto-update product price & stock
exports.addVariant = async (req, res) => {
    const t = await ProductVariant.sequelize.transaction();

    try {
        const { productId } = req.params;
        const { color_id, storage_id, price, stock, sku } = req.body;

        // Validate product exists
        const product = await Product.findByPk(productId, { transaction: t });
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Check if variant already exists
        const existing = await ProductVariant.findOne({
            where: {
                product_id: productId,
                color_id: color_id || null,
                storage_id: storage_id || null
            },
            transaction: t
        });

        if (existing) {
            await t.rollback();
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
        }, { transaction: t });

        // ✅ AUTO-UPDATE: Recalculate product price & stock
        const allVariants = await ProductVariant.findAll({
            where: { product_id: productId },
            transaction: t
        });

        let minPrice = Infinity;
        let totalStock = 0;

        for (const v of allVariants) {
            if (v.price < minPrice) minPrice = v.price;
            totalStock += v.stock;
        }

        // Update product
        product.price = minPrice;
        product.stock = totalStock;
        await product.save({ transaction: t });

        console.log(`✅ Product #${productId} updated: price=${minPrice}, stock=${totalStock}`);

        await t.commit();

        // Fetch with relations
        const createdVariant = await ProductVariant.findByPk(variant.id, {
            include: [
                { model: Color, attributes: ['id', 'name'] },
                { model: Storage, attributes: ['id', 'name'] }
            ]
        });

        res.status(201).json({
            message: "Variant berhasil ditambahkan dan stok produk diperbarui",
            variant: createdVariant
        });
    } catch (err) {
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Error adding variant:", err);
        res.status(500).json({ message: "Gagal menambahkan variant", error: err.message });
    }
};

// ✅ UPDATED: Update variant with auto-update product price & stock
exports.updateVariant = async (req, res) => {
    const t = await ProductVariant.sequelize.transaction();

    try {
        const { variantId } = req.params;
        const { color_id, storage_id, price, stock, sku } = req.body;

        const variant = await ProductVariant.findByPk(variantId, { transaction: t });
        if (!variant) {
            await t.rollback();
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
                },
                transaction: t
            });

            if (existing) {
                await t.rollback();
                return res.status(400).json({ message: "Variant dengan kombinasi ini sudah ada" });
            }
        }

        // Update variant
        await variant.update({
            color_id: color_id !== undefined ? color_id : variant.color_id,
            storage_id: storage_id !== undefined ? storage_id : variant.storage_id,
            price: price !== undefined ? price : variant.price,
            stock: stock !== undefined ? stock : variant.stock,
            sku: sku !== undefined ? sku : variant.sku
        }, { transaction: t });

        // ✅ AUTO-UPDATE: Recalculate product price & stock
        const allVariants = await ProductVariant.findAll({
            where: { product_id: variant.product_id },
            transaction: t
        });

        let minPrice = Infinity;
        let totalStock = 0;

        for (const v of allVariants) {
            if (v.price < minPrice) minPrice = v.price;
            totalStock += v.stock;
        }

        // Update product
        const product = await Product.findByPk(variant.product_id, { transaction: t });
        product.price = minPrice;
        product.stock = totalStock;
        await product.save({ transaction: t });

        console.log(`✅ Product #${variant.product_id} updated: price=${minPrice}, stock=${totalStock}`);

        await t.commit();

        // Fetch updated with relations
        const updated = await ProductVariant.findByPk(variantId, {
            include: [
                { model: Color, attributes: ['id', 'name'] },
                { model: Storage, attributes: ['id', 'name'] }
            ]
        });

        res.json({ message: "Variant berhasil diupdate dan stok produk diperbarui", variant: updated });
    } catch (err) {
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Error updating variant:", err);
        res.status(500).json({ message: "Gagal mengupdate variant", error: err.message });
    }
};

// ✅ UPDATED: Delete variant with auto-update product price & stock
exports.deleteVariant = async (req, res) => {
    const t = await ProductVariant.sequelize.transaction();

    try {
        const { variantId } = req.params;

        const variant = await ProductVariant.findByPk(variantId, { transaction: t });
        if (!variant) {
            await t.rollback();
            return res.status(404).json({ message: "Variant tidak ditemukan" });
        }

        const productId = variant.product_id;

        // Delete variant
        await variant.destroy({ transaction: t });

        // ✅ AUTO-UPDATE: Recalculate product price & stock
        const remainingVariants = await ProductVariant.findAll({
            where: { product_id: productId },
            transaction: t
        });

        const product = await Product.findByPk(productId, { transaction: t });

        if (remainingVariants.length === 0) {
            // No variants left - set to 0
            product.price = 0;
            product.stock = 0;
            console.log(`⚠️ Product #${productId} has no variants left - price & stock set to 0`);
        } else {
            // Recalculate from remaining variants
            let minPrice = Infinity;
            let totalStock = 0;

            for (const v of remainingVariants) {
                if (v.price < minPrice) minPrice = v.price;
                totalStock += v.stock;
            }

            product.price = minPrice;
            product.stock = totalStock;
            console.log(`✅ Product #${productId} updated: price=${minPrice}, stock=${totalStock}`);
        }

        await product.save({ transaction: t });
        await t.commit();

        res.json({ message: "Variant berhasil dihapus dan stok produk diperbarui" });
    } catch (err) {
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Error deleting variant:", err);
        res.status(500).json({ message: "Gagal menghapus variant", error: err.message });
    }
};

// ✅ UPDATED: Bulk add variants with auto-update product price & stock
exports.bulkAddVariants = async (req, res) => {
    const t = await ProductVariant.sequelize.transaction();

    try {
        const { productId } = req.params;
        const { variants } = req.body; // Array of {color_id, storage_id, price, stock}

        // Validate product
        const product = await Product.findByPk(productId, { transaction: t });
        if (!product) {
            await t.rollback();
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
                    },
                    transaction: t
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
                }, { transaction: t });

                created.push(variant);
            } catch (err) {
                errors.push({ variant: v, error: err.message });
            }
        }

        // ✅ AUTO-UPDATE: Recalculate product price & stock
        const allVariants = await ProductVariant.findAll({
            where: { product_id: productId },
            transaction: t
        });

        let minPrice = Infinity;
        let totalStock = 0;

        for (const v of allVariants) {
            if (v.price < minPrice) minPrice = v.price;
            totalStock += v.stock;
        }

        product.price = minPrice;
        product.stock = totalStock;
        await product.save({ transaction: t });

        console.log(`✅ Product #${productId} updated: price=${minPrice}, stock=${totalStock}`);

        await t.commit();

        res.status(201).json({
            message: `${created.length} variant berhasil ditambahkan dan stok produk diperbarui`,
            created: created.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (err) {
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Error bulk adding variants:", err);
        res.status(500).json({ message: "Gagal menambahkan variants", error: err.message });
    }
};
