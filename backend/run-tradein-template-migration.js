const { TradeInTemplate, TradeInPhone, sequelize } = require("./src/models");

async function runTemplateBasedMigration() {
    try {
        console.log("🚀 Starting Template-Based Trade-In migration...");

        // Create tables
        await TradeInTemplate.sync({ force: true });
        await TradeInPhone.sync({ force: true });

        console.log("✅ Tables created successfully!");

        // ===== CREATE TEMPLATES =====
        const templates = [
            {
                name: "iPhone 11-12 Template",
                description: "For iPhone 11 and 12 series",
                base_price_min: 5000000,
                base_price_max: 8000000,
                component_prices: {
                    battery: 370000,
                    lcd: 1250000,
                    kamera_belakang: 800000,
                    kamera_depan: 350000,
                    glass_kamera: 100000,
                    jamur: 230000,
                    backglass: 350000,
                    housing: 550000,
                    speaker_bawah: 350000,
                    speaker_atas: 350000,
                    charger: 600000,
                    onoff: 350000,
                    volume: 350000,
                    vibrate: 250000,
                    faceid: 1300000,
                },
            },
            {
                name: "iPhone 13-14 Template",
                description: "For iPhone 13 and 14 series",
                base_price_min: 7000000,
                base_price_max: 12000000,
                component_prices: {
                    battery: 450000,
                    lcd: 1950000,
                    kamera_belakang: 780000,
                    kamera_depan: 450000,
                    glass_kamera: 125000,
                    jamur: 250000,
                    backglass: 350000,
                    housing: 600000,
                    speaker_bawah: 400000,
                    speaker_atas: 400000,
                    charger: 650000,
                    onoff: 380000,
                    volume: 400000,
                    vibrate: 300000,
                    faceid: 1500000,
                },
            },
            {
                name: "iPhone 15-16 Template",
                description: "For iPhone 15 and 16 series (latest)",
                base_price_min: 13000000,
                base_price_max: 20000000,
                component_prices: {
                    battery: 750000,
                    lcd: 3300000,
                    kamera_belakang: 1200000,
                    kamera_depan: 800000,
                    glass_kamera: 280000,
                    jamur: 450000,
                    backglass: 450000,
                    housing: 1100000,
                    speaker_bawah: 500000,
                    speaker_atas: 500000,
                    charger: 1200000,
                    onoff: 500000,
                    volume: 400000,
                    vibrate: 400000,
                    faceid: 2100000,
                },
            },
            {
                name: "Pro Max Premium Template",
                description: "For Pro Max variants with premium pricing",
                base_price_min: 14000000,
                base_price_max: 32000000,
                component_prices: {
                    battery: 950000,
                    lcd: 4800000,
                    kamera_belakang: 1900000,
                    kamera_depan: 950000,
                    glass_kamera: 300000,
                    jamur: 500000,
                    backglass: 500000,
                    housing: 1600000,
                    speaker_bawah: 500000,
                    speaker_atas: 500000,
                    charger: 1400000,
                    onoff: 550000,
                    volume: 530000,
                    vibrate: 420000,
                    faceid: 2200000,
                },
            },
        ];

        const createdTemplates = await TradeInTemplate.bulkCreate(templates);
        console.log(`✅ ${createdTemplates.length} templates created!`);

        // ===== CREATE SAMPLE PHONES USING TEMPLATES =====
        const phones = [
            // iPhone 13 Series (using iPhone 13-14 Template)
            {
                model: "iPhone 13",
                category: "Mini",
                year: 2021,
                price_min: 6000000,
                price_max: 8000000,
                template_id: createdTemplates[1].id, // iPhone 13-14 Template
            },
            {
                model: "iPhone 13",
                category: "Standard",
                year: 2021,
                price_min: 7000000,
                price_max: 9000000,
                template_id: createdTemplates[1].id,
            },
            {
                model: "iPhone 13",
                category: "Pro",
                year: 2021,
                price_min: 8000000,
                price_max: 12000000,
                template_id: createdTemplates[1].id,
            },
            {
                model: "iPhone 13",
                category: "Pro Max",
                year: 2021,
                price_min: 9000000,
                price_max: 14000000,
                template_id: createdTemplates[3].id, // Pro Max Premium Template
            },

            // iPhone 14 Series (using iPhone 13-14 Template)
            {
                model: "iPhone 14",
                category: "Standard",
                year: 2022,
                price_min: 9000000,
                price_max: 12000000,
                template_id: createdTemplates[1].id,
            },
            {
                model: "iPhone 14",
                category: "Plus",
                year: 2022,
                price_min: 10000000,
                price_max: 13000000,
                template_id: createdTemplates[1].id,
            },
            {
                model: "iPhone 14",
                category: "Pro",
                year: 2022,
                price_min: 12000000,
                price_max: 16000000,
                template_id: createdTemplates[1].id,
            },
            {
                model: "iPhone 14",
                category: "Pro Max",
                year: 2022,
                price_min: 14000000,
                price_max: 18000000,
                template_id: createdTemplates[3].id,
            },

            // iPhone 15 Series (using iPhone 15-16 Template)
            {
                model: "iPhone 15",
                category: "Standard",
                year: 2023,
                price_min: 13000000,
                price_max: 16000000,
                template_id: createdTemplates[2].id,
            },
            {
                model: "iPhone 15",
                category: "Plus",
                year: 2023,
                price_min: 14000000,
                price_max: 17000000,
                template_id: createdTemplates[2].id,
            },
            {
                model: "iPhone 15",
                category: "Pro",
                year: 2023,
                price_min: 16000000,
                price_max: 20000000,
                template_id: createdTemplates[2].id,
            },
            {
                model: "iPhone 15",
                category: "Pro Max",
                year: 2023,
                price_min: 18000000,
                price_max: 24000000,
                template_id: createdTemplates[3].id,
            },

            // iPhone 16 Series (using iPhone 15-16 Template)
            {
                model: "iPhone 16",
                category: "Standard",
                year: 2024,
                price_min: 16000000,
                price_max: 20000000,
                template_id: createdTemplates[2].id,
            },
            {
                model: "iPhone 16",
                category: "Plus",
                year: 2024,
                price_min: 18000000,
                price_max: 22000000,
                template_id: createdTemplates[2].id,
            },
            {
                model: "iPhone 16",
                category: "Pro",
                year: 2024,
                price_min: 20000000,
                price_max: 26000000,
                template_id: createdTemplates[2].id,
            },
            {
                model: "iPhone 16",
                category: "Pro Max",
                year: 2024,
                price_min: 24000000,
                price_max: 32000000,
                template_id: createdTemplates[3].id,
            },
        ];

        const createdPhones = await TradeInPhone.bulkCreate(phones);
        console.log(`✅ ${createdPhones.length} phones created!`);

        console.log("\n📊 Summary:");
        console.log(`   Templates: ${createdTemplates.length}`);
        console.log(`   Phones: ${createdPhones.length}`);
        console.log(`   Total component prices: ${createdTemplates.length * 15} (stored in templates)`);
        console.log("\n🎉 Template-Based migration completed successfully!");
        console.log("\n💡 Benefits:");
        console.log("   - Easy bulk operations");
        console.log("   - Template inheritance");
        console.log("   - Custom overrides supported");
        console.log("   - Much easier to maintain!\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

runTemplateBasedMigration();
