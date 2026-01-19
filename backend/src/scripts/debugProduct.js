const { Product, Category, ProductVariant, Tag, ProductTag } = require('../models');

async function debugProduct() {
    try {
        const id = 57;
        console.log(`🔍 Debugging Product ID: ${id}`);

        // Test 1: Basic Fetch
        const p1 = await Product.findByPk(id);
        console.log("Test 1 (Basic):", p1 ? "✅ Found" : "❌ Not Found");

        // Test 2: Include Category
        const p2 = await Product.findByPk(id, { include: [{ model: Category }] });
        console.log("Test 2 (+Category):", p2 ? "✅ Found" : "❌ Not Found");

        // Test 3: Include Variants
        const p3 = await Product.findByPk(id, {
            include: [{ model: ProductVariant, as: 'variants' }]
        });
        console.log("Test 3 (+Variants):", p3 ? "✅ Found" : "❌ Not Found");

        // Test 4: Include Tags (Often problematic)
        // Note: checking if standard include works
        try {
            const p4 = await Product.findByPk(id, {
                include: [{ model: Tag, as: 'tags' }]
            });
            console.log("Test 4 (+Tags Basic):", p4 ? "✅ Found" : "❌ Not Found");
        } catch (e) {
            console.log("Test 4 (+Tags Basic): ❌ ERROR -", e.message);
        }

    } catch (error) {
        console.error("❌ Fatal Error:", error);
    }
}

debugProduct();
