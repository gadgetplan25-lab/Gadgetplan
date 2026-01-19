const { Product } = require('../models');

async function listProducts() {
    try {
        const products = await Product.findAll({
            attributes: ['id', 'name', 'price', 'stock']
        });

        console.log("✅ TOTAL PRODUCTS: " + products.length);
        products.forEach(p => {
            console.log(`🆔 ID: ${p.id} | 📦 Name: ${p.name}`);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

listProducts();
