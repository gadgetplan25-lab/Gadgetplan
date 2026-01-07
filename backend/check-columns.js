const mysql = require("mysql2/promise");
require("dotenv").config();

async function checkColumns() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "ecommerce_db",
    });

    try {
        const [rows] = await connection.query("SHOW COLUMNS FROM orders");
        console.log("Columns in orders table:");
        rows.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await connection.end();
    }
}

checkColumns();
