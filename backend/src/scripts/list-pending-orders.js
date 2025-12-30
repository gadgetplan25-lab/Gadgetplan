require('dotenv').config();
const { Order, Payment } = require('../models');

/**
 * Script untuk melihat semua order yang masih pending
 * Gunakan untuk cari order yang bisa di-test
 */

async function listPendingOrders() {
    try {
        console.log('🔍 Mencari order dengan status pending...\n');

        const orders = await Order.findAll({
            where: { status: 'pending' },
            include: [Payment],
            order: [['id', 'DESC']],
            limit: 10
        });

        if (orders.length === 0) {
            console.log('✅ Tidak ada order pending.');
            console.log('💡 Buat order baru dari frontend untuk test webhook.\n');
            process.exit(0);
        }

        console.log(`📦 Ditemukan ${orders.length} order pending:\n`);
        console.log('========================================');

        orders.forEach(order => {
            console.log(`Order #${order.id}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Total: Rp ${order.total_price?.toLocaleString('id-ID')}`);
            console.log(`  Created: ${order.createdAt}`);

            if (order.Payment) {
                console.log(`  Payment Status: ${order.Payment.status}`);
                console.log(`  Transaction ID: ${order.Payment.transaction_id || 'N/A'}`);
            } else {
                console.log(`  Payment: ❌ Tidak ada payment record`);
            }
            console.log('----------------------------------------');
        });

        console.log('\n💡 Untuk simulate webhook, jalankan:');
        console.log(`   node src/scripts/simulate-webhook.js <ORDER_ID>`);
        console.log(`\n   Contoh: node src/scripts/simulate-webhook.js ${orders[0].id}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listPendingOrders();
