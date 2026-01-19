#!/usr/bin/env node
/**
 * 🚀 VPS Deployment Migration Script
 * Runs all database migrations in correct order
 * Usage: node deploy-migrations.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Migration files in execution order
const MIGRATIONS = [
    'create_product_variants.sql',
    'add_variant_to_cartitems.sql',
    'add_variant_to_orderitems.sql',
    'add_shipping_to_orders.sql',
    'add_missing_fields_to_orders.sql'
];

async function runMigrations() {
    let connection;

    try {
        console.log('🔌 Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'toko_online',
            multipleStatements: true
        });

        console.log('✅ Connected to database:', process.env.DB_NAME);
        console.log('');

        // Run each migration
        for (const migrationFile of MIGRATIONS) {
            const filePath = path.join(__dirname, '..', 'database', 'migrations', migrationFile);

            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  Skipping ${migrationFile} (file not found)`);
                continue;
            }

            try {
                console.log(`🚀 Running: ${migrationFile}`);
                const sql = fs.readFileSync(filePath, 'utf8');
                await connection.query(sql);
                console.log(`✅ Success: ${migrationFile}`);
            } catch (error) {
                // Check if error is "column already exists" or "table already exists"
                if (error.code === 'ER_DUP_FIELDNAME' ||
                    error.code === 'ER_TABLE_EXISTS_ERROR' ||
                    error.message.includes('Duplicate column') ||
                    error.message.includes('already exists')) {
                    console.log(`⏭️  Skipped: ${migrationFile} (already applied)`);
                } else {
                    console.error(`❌ Failed: ${migrationFile}`);
                    console.error(`   Error: ${error.message}`);
                    throw error;
                }
            }
            console.log('');
        }

        console.log('🎉 All migrations completed successfully!');
        console.log('');
        console.log('📊 Summary:');
        console.log(`   Database: ${process.env.DB_NAME}`);
        console.log(`   Migrations: ${MIGRATIONS.length}`);
        console.log('');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Database connection closed');
        }
    }
}

// Run migrations
runMigrations();
