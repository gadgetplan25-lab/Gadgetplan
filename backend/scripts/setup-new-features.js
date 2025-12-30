require("dotenv").config();
const { sequelize } = require("./src/models");

async function setupNewTables() {
    try {
        console.log("🔧 Setting up new tables for Medium Priority features...\n");

        // Create Wishlists table
        console.log("📝 Creating Wishlists table...");
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Wishlists (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
        console.log("✅ Wishlists table created\n");

        // Create ProductReviews table
        console.log("📝 Creating ProductReviews table...");
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS ProductReviews (
        id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        user_id INT NOT NULL,
        order_id INT,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        review TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE SET NULL,
        UNIQUE KEY unique_user_product_review (user_id, product_id, order_id)
      )
    `);
        console.log("✅ ProductReviews table created\n");

        // Create indexes
        console.log("📊 Creating indexes...");

        try {
            await sequelize.query("CREATE INDEX idx_wishlists_user_id ON Wishlists(user_id)");
            console.log("  ✅ idx_wishlists_user_id");
        } catch (e) {
            console.log("  ⏭️  idx_wishlists_user_id (already exists)");
        }

        try {
            await sequelize.query("CREATE INDEX idx_wishlists_product_id ON Wishlists(product_id)");
            console.log("  ✅ idx_wishlists_product_id");
        } catch (e) {
            console.log("  ⏭️  idx_wishlists_product_id (already exists)");
        }

        try {
            await sequelize.query("CREATE INDEX idx_reviews_product_id ON ProductReviews(product_id)");
            console.log("  ✅ idx_reviews_product_id");
        } catch (e) {
            console.log("  ⏭️  idx_reviews_product_id (already exists)");
        }

        try {
            await sequelize.query("CREATE INDEX idx_reviews_user_id ON ProductReviews(user_id)");
            console.log("  ✅ idx_reviews_user_id");
        } catch (e) {
            console.log("  ⏭️  idx_reviews_user_id (already exists)");
        }

        try {
            await sequelize.query("CREATE INDEX idx_reviews_rating ON ProductReviews(rating)");
            console.log("  ✅ idx_reviews_rating");
        } catch (e) {
            console.log("  ⏭️  idx_reviews_rating (already exists)");
        }

        console.log("\n🎉 All tables and indexes created successfully!");
        console.log("\n📋 Next steps:");
        console.log("1. Restart backend server");
        console.log("2. Models will auto-register on next server start");
        console.log("3. Routes are ready to use");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error setting up tables:", error);
        console.error("\nTry running the SQL manually in phpMyAdmin:");
        console.error("File: backend/create-new-tables.sql");
        process.exit(1);
    }
}

setupNewTables();
