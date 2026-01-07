// Script untuk run migration SQL
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        console.log('🔄 Connecting to database...');

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'toko_online',
            multipleStatements: true
        });

        console.log('✅ Connected to database');
        console.log('📄 Reading migration file...');

        const sqlFile = path.join(__dirname, 'migrations', 'create_product_variants.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('🚀 Running migration...');
        await connection.query(sql);

        console.log('✅ Migration completed successfully!');
        console.log('📊 Table "product_variants" has been created');

        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
