require('dotenv').config();
const { Order, Payment } = require('../models');

async function updateAllPendingOrders() {
    try {
        console.log('\n🔄 Updating all pending orders...\n');

        // Cari semua order dengan status pending
        const pendingOrders = await Order.findAll({
            where: { status: 'pending' },
            include: [Payment],
            order: [['id', 'ASC']]
        });

        if (pendingOrders.length === 0) {
            console.log('✅ Tidak ada order pending.\n');
            process.exit(0);
        }

        console.log(`📦 Ditemukan ${pendingOrders.length} order pending:\n`);

        for (const order of pendingOrders) {
            console.log(`\n🔄 Updating Order #${order.id}...`);

            // Update order status
            await Order.update(
                { status: 'paid' },
                { where: { id: order.id } }
            );

            // Update payment status
            if (order.Payment) {
                await Payment.update(
                    {
                        status: 'success',
                        method: 'BANK_TRANSFER-BCA'
                    },
                    { where: { id: order.Payment.id } }
                );
            }

            console.log(`✅ Order #${order.id} updated to PAID`);
        }

        console.log('\n' + '='.repeat(50));
        console.log(`✅ Semua ${pendingOrders.length} order berhasil diupdate!`);
        console.log('='.repeat(50) + '\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

updateAllPendingOrders();
