require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', 'remove_shipping_fields.sql'), 'utf8');
        console.log('Running migration: remove_shipping_fields.sql');
        await connection.query(sql);
        console.log('Migration successful');
    } catch (error) {
        if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log('Columns already dropped or do not exist.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        await connection.end();
    }
}

runMigration();
