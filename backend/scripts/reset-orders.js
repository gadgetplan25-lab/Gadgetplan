require('dotenv').config();
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

// Fix for Node 18+ preferring IPv6
if (process.env.DB_HOST === 'localhost') {
    console.log('🔧 Overriding DB_HOST to 127.0.0.1');
    process.env.DB_HOST = '127.0.0.1';
}

const { Sequelize } = require('sequelize');
const { Order, OrderItem, Payment, Booking, BookingPayment, Cart, CartItem } = require('../src/models');

// Hardcoded for troubleshooting
const sequelize = new Sequelize('toko_online', 'root', '', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
});

async function resetOrders() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        console.log('🗑️ Resetting orders and bookings...');

        // Use raw query to truncate tables to avoid Sequelize cascade issues with truncates
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

        console.log(' - Truncating OrderItems (orderitems)...');
        await sequelize.query('TRUNCATE TABLE `orderitems`', { raw: true });

        console.log(' - Truncating Payments (payments)...');
        await sequelize.query('TRUNCATE TABLE `payments`', { raw: true });

        console.log(' - Truncating Orders (orders)...');
        await sequelize.query('TRUNCATE TABLE `orders`', { raw: true });

        console.log(' - Truncating BookingPayments (bookingpayments)...');
        await sequelize.query('TRUNCATE TABLE `bookingpayments`', { raw: true });

        console.log(' - Truncating Bookings (bookings)...');
        await sequelize.query('TRUNCATE TABLE `bookings`', { raw: true });

        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });

        console.log('✅ All orders and bookings have been securely deleted and IDs reset.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to reset orders:', error);
        process.exit(1);
    }
}

resetOrders();
