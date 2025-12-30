require('dotenv').config();
const { Order, Payment } = require('../models');

async function checkRecentOrders() {
    try {
        console.log('\n🔍 Checking recent orders...\n');

        const orders = await Order.findAll({
            include: [Payment],
            order: [['id', 'DESC']],
            limit: 5
        });

        if (orders.length === 0) {
            console.log('❌ Tidak ada order ditemukan.\n');
            process.exit(0);
        }

        console.log(`📦 ${orders.length} order terakhir:\n`);
        console.log('='.repeat(80));

        orders.forEach(order => {
            console.log(`\n📋 Order #${order.id}`);
            console.log(`   Status Order: ${order.status}`);
            console.log(`   Total: Rp ${order.total_price?.toLocaleString('id-ID')}`);
            console.log(`   Shipping: Rp ${order.shipping_cost?.toLocaleString('id-ID') || 0}`);
            console.log(`   Created: ${new Date(order.createdAt).toLocaleString('id-ID')}`);

            if (order.Payment) {
                console.log(`\n   💳 Payment Info:`);
                console.log(`      ID: ${order.Payment.id}`);
                console.log(`      Status: ${order.Payment.status}`);
                console.log(`      Method: ${order.Payment.method || 'N/A'}`);
                console.log(`      Transaction ID: ${order.Payment.transaction_id || 'N/A'}`);
            } else {
                console.log(`\n   ❌ No payment record`);
            }
            console.log('-'.repeat(80));
        });

        console.log('\n✅ Done!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

checkRecentOrders();
