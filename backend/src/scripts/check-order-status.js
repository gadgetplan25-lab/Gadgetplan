require('dotenv').config();
const { Order, Payment } = require('../models');

async function checkOrderStatus() {
    const orderId = process.argv[2] || 96;

    try {
        const order = await Order.findByPk(orderId, {
            include: [Payment]
        });

        if (!order) {
            console.log(`❌ Order #${orderId} tidak ditemukan`);
            return;
        }

        console.log("========================================");
        console.log(`📦 Order #${order.id} - Status Check`);
        console.log("========================================");
        console.log(`Status Order: ${order.status}`);
        console.log(`Total Price: Rp ${order.total_price?.toLocaleString('id-ID')}`);
        console.log(`Shipping Cost: Rp ${order.shipping_cost?.toLocaleString('id-ID') || 0}`);
        console.log(`Created: ${order.createdAt}`);
        console.log(`Updated: ${order.updatedAt}`);

        if (order.Payment) {
            console.log("\n💳 Payment Info:");
            console.log(`  Status: ${order.Payment.status}`);
            console.log(`  Method: ${order.Payment.method || '-'}`);
            console.log(`  Transaction ID: ${order.Payment.transaction_id || '-'}`);
        }

        console.log("========================================");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

checkOrderStatus();
