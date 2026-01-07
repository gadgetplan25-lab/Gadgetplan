const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function runMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "ecommerce_db",
    });

    try {
        console.log("✅ Connected to database");

        const sql = fs.readFileSync(
            path.join(__dirname, "..", "database", "migrations", "add_variant_to_orderitems.sql"),
            "utf8"
        );

        await connection.query(sql);
        console.log("✅ Migration add_variant_to_orderitems.sql executed successfully");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await connection.end();
    }
}

runMigration();
