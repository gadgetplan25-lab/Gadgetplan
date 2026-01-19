const { Product, Category, ProductVariant, Tag, ProductTag, Color, Storage, ProductImage } = require('../models');

async function debugAllProducts() {
    try {
        console.log(`🔍 Debugging getAllProducts...`);

        const products = await Product.findAll({
            include: [
                { model: Tag, as: "tags", through: { attributes: [] } },
                { model: Category, attributes: ["id", "name"] },
                { model: ProductImage, attributes: ["id", "image_url"] }
            ],
            limit: 2
        });

        console.log(`✅ Found ${products.length} products`);
        if (products.length > 0) {
            console.log("FIRST PRODUCT ID:", products[0].id);
            console.log("FIRST PRODUCT NAME:", products[0].name);
            console.log("FULL JSON:", JSON.stringify(products[0].toJSON(), null, 2));
        }

    } catch (error) {
        console.error("❌ Fatal Error:", error);
        console.error(error);
    }
}

debugAllProducts();
