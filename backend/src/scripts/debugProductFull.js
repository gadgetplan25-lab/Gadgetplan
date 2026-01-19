const { Product, Category, ProductVariant, Tag, ProductTag, Color, Storage, ProductImage } = require('../models');

async function debugProductFull() {
    try {
        const id = 57;
        console.log(`🔍 Debugging Product ID: ${id} FULL INCLUDE`);

        const product = await Product.findByPk(id, {
            include: [
                { model: Category, attributes: ["id", "name"] },
                { model: ProductImage, attributes: ["id", "image_url"] },
                {
                    model: Tag,
                    as: "tags",
                    attributes: ["id", "name"],
                    // Note: using checking if through attributes matters
                    through: { attributes: [] },
                },
                {
                    model: ProductVariant,
                    as: "variants",
                    attributes: ["id", "color_id", "storage_id", "price", "stock"],
                    include: [
                        { model: Color, attributes: ["id", "name"] },
                        { model: Storage, attributes: ["id", "name"] }
                    ]
                }
            ],
        });

        if (product) {
            console.log("✅ FOUND FULL PRODUCT!");
            console.log(JSON.stringify(product.toJSON(), null, 2));
        } else {
            console.log("❌ NOT FOUND with full include");
        }

    } catch (error) {
        console.error("❌ Fatal Error:", error);
    }
}

debugProductFull();
