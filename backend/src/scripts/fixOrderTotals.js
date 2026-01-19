const { Order, OrderItem } = require("../models");
const sequelize = require("../config/db");

async function fixOrderTotals() {
    try {
        console.log("🚀 Starting Order Total Fix...");

        // Fetch all orders with items
        const orders = await Order.findAll({
            include: [{
                model: OrderItem,
                as: 'OrderItems' // Pastikan alias sesuai model
            }]
        });

        console.log(`📊 Found ${orders.length} orders to check.`);

        let updatedCount = 0;

        for (const order of orders) {
            if (!order.OrderItems || order.OrderItems.length === 0) {
                console.log(`⚠️ Order #${order.id} has no items. Skipping.`);
                continue;
            }

            // Calculate pure product total
            const realProductTotal = order.OrderItems.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            // Compare with current total_price
            // Use subtle tolerance for float comparison just in case
            if (Math.abs(order.total_price - realProductTotal) > 1) {
                console.log(`🔄 Fixing Order #${order.id}: ${order.total_price} -> ${realProductTotal}`);

                order.total_price = realProductTotal;

                // Jika ada kolom shipping_cost (meski tidak di model), kita biarkan saja (karena tidak bisa diakses via model standard)
                // Tapi yang penting total_price sekarang murni harga barang.

                await order.save();
                updatedCount++;
            }
        }

        console.log("----------------------------------------");
        console.log(`✅ Finished! Updated ${updatedCount} orders.`);

    } catch (error) {
        console.error("❌ Error during fix:", error);
    } finally {
        await sequelize.close();
    }
}

fixOrderTotals();
