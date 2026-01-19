const { TradeInTemplate, TradeInPhone } = require("../models");

// ===== TEMPLATES =====

// Get all templates
exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await TradeInTemplate.findAll({
            where: { is_active: true },
            order: [["name", "ASC"]],
        });
        res.json({ templates });
    } catch (err) {
        console.error("Error fetching templates:", err);
        res.status(500).json({ message: "Gagal mengambil templates", error: err.message });
    }
};

// Get single template
exports.getTemplateById = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await TradeInTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template tidak ditemukan" });
        }
        res.json({ template });
    } catch (err) {
        console.error("Error fetching template:", err);
        res.status(500).json({ message: "Gagal mengambil template", error: err.message });
    }
};

// Create template
exports.createTemplate = async (req, res) => {
    try {
        const { name, description, base_price_min, base_price_max, component_prices } = req.body;

        // Validate
        if (!name || !base_price_min || !base_price_max || !component_prices) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const template = await TradeInTemplate.create({
            name,
            description,
            base_price_min,
            base_price_max,
            component_prices,
        });

        res.status(201).json({ message: "Template berhasil dibuat", template });
    } catch (err) {
        console.error("Error creating template:", err);
        res.status(500).json({ message: "Gagal membuat template", error: err.message });
    }
};

// Update template
exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, base_price_min, base_price_max, component_prices, is_active } = req.body;

        const template = await TradeInTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template tidak ditemukan" });
        }

        await template.update({
            name,
            description,
            base_price_min,
            base_price_max,
            component_prices,
            is_active,
        });

        res.json({ message: "Template berhasil diupdate", template });
    } catch (err) {
        console.error("Error updating template:", err);
        res.status(500).json({ message: "Gagal mengupdate template", error: err.message });
    }
};

// Delete template
exports.deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if any phones use this template
        const phonesUsingTemplate = await TradeInPhone.count({ where: { template_id: id } });
        if (phonesUsingTemplate > 0) {
            return res.status(400).json({
                message: `Tidak bisa hapus template. ${phonesUsingTemplate} phone masih menggunakan template ini.`,
            });
        }

        const template = await TradeInTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: "Template tidak ditemukan" });
        }

        await template.destroy();
        res.json({ message: "Template berhasil dihapus" });
    } catch (err) {
        console.error("Error deleting template:", err);
        res.status(500).json({ message: "Gagal menghapus template", error: err.message });
    }
};

// ===== PHONES =====

// Get all phones (with template data)
exports.getAllPhones = async (req, res) => {
    try {
        const phones = await TradeInPhone.findAll({
            where: { is_active: true },
            include: [
                {
                    model: TradeInTemplate,
                    as: "template",
                    attributes: ["id", "name", "component_prices"],
                },
            ],
            order: [["model", "ASC"], ["category", "ASC"]],
        });

        // Merge template data with custom overrides
        const phonesWithDeductions = phones.map((phone) => {
            const phoneData = phone.toJSON();

            // Get deductions from template or custom
            let deductions = {};
            if (phoneData.template) {
                deductions = phoneData.template.component_prices || {};
            }

            // Override with custom deductions if exists
            if (phoneData.custom_deductions) {
                deductions = { ...deductions, ...phoneData.custom_deductions };
            }

            return {
                ...phoneData,
                deductions,
            };
        });

        res.json({ phones: phonesWithDeductions });
    } catch (err) {
        console.error("Error fetching phones:", err);
        res.status(500).json({ message: "Gagal mengambil data phones", error: err.message });
    }
};

// Get phone by ID
exports.getPhoneById = async (req, res) => {
    try {
        const { id } = req.params;
        const phone = await TradeInPhone.findByPk(id, {
            include: [
                {
                    model: TradeInTemplate,
                    as: "template",
                },
            ],
        });

        if (!phone) {
            return res.status(404).json({ message: "Phone tidak ditemukan" });
        }

        res.json({ phone });
    } catch (err) {
        console.error("Error fetching phone:", err);
        res.status(500).json({ message: "Gagal mengambil data phone", error: err.message });
    }
};

// Get deductions for specific phone (for user frontend)
exports.getPhoneDeductions = async (req, res) => {
    try {
        const { model, category } = req.params;

        const phone = await TradeInPhone.findOne({
            where: { model, category, is_active: true },
            include: [
                {
                    model: TradeInTemplate,
                    as: "template",
                },
            ],
        });

        if (!phone) {
            return res.status(404).json({ message: "Phone tidak ditemukan" });
        }

        // Get deductions from template
        let deductions = phone.template ? phone.template.component_prices : {};

        // Override with custom if exists
        if (phone.custom_deductions) {
            deductions = { ...deductions, ...phone.custom_deductions };
        }

        res.json({
            model: phone.model,
            category: phone.category,
            price_min: phone.price_min,
            price_max: phone.price_max,
            deductions,
        });
    } catch (err) {
        console.error("Error fetching deductions:", err);
        res.status(500).json({ message: "Gagal mengambil data potongan", error: err.message });
    }
};

// Create phone
exports.createPhone = async (req, res) => {
    try {
        const { model, category, year, price_min, price_max, template_id, custom_deductions } = req.body;

        if (!model || !price_min || !price_max) {
            return res.status(400).json({ message: "Data tidak lengkap" });
        }

        const phone = await TradeInPhone.create({
            model,
            category,
            year,
            price_min,
            price_max,
            template_id,
            custom_deductions,
        });

        res.status(201).json({ message: "Phone berhasil ditambahkan", phone });
    } catch (err) {
        console.error("Error creating phone:", err);
        res.status(500).json({ message: "Gagal menambahkan phone", error: err.message });
    }
};

// Bulk create phones from template
exports.bulkCreatePhones = async (req, res) => {
    try {
        const { template_id, phones } = req.body;

        if (!template_id || !phones || !Array.isArray(phones)) {
            return res.status(400).json({ message: "Data tidak valid" });
        }

        // Get template
        const template = await TradeInTemplate.findByPk(template_id);
        if (!template) {
            return res.status(404).json({ message: "Template tidak ditemukan" });
        }

        // Create phones with template
        const phonesToCreate = phones.map((phone) => ({
            model: phone.model,
            category: phone.category,
            year: phone.year,
            price_min: phone.price_min || template.base_price_min,
            price_max: phone.price_max || template.base_price_max,
            template_id: template_id,
            custom_deductions: phone.custom_deductions || null,
        }));

        const createdPhones = await TradeInPhone.bulkCreate(phonesToCreate);

        res.status(201).json({
            message: `${createdPhones.length} phones berhasil ditambahkan`,
            phones: createdPhones,
        });
    } catch (err) {
        console.error("Error bulk creating phones:", err);
        res.status(500).json({ message: "Gagal menambahkan phones", error: err.message });
    }
};

// Update phone
exports.updatePhone = async (req, res) => {
    try {
        const { id } = req.params;
        const { model, category, year, price_min, price_max, template_id, custom_deductions, is_active } = req.body;

        const phone = await TradeInPhone.findByPk(id);
        if (!phone) {
            return res.status(404).json({ message: "Phone tidak ditemukan" });
        }

        await phone.update({
            model,
            category,
            year,
            price_min,
            price_max,
            template_id,
            custom_deductions,
            is_active,
        });

        res.json({ message: "Phone berhasil diupdate", phone });
    } catch (err) {
        console.error("Error updating phone:", err);
        res.status(500).json({ message: "Gagal mengupdate phone", error: err.message });
    }
};

// Delete phone
exports.deletePhone = async (req, res) => {
    try {
        const { id } = req.params;
        const phone = await TradeInPhone.findByPk(id);

        if (!phone) {
            return res.status(404).json({ message: "Phone tidak ditemukan" });
        }

        await phone.destroy();
        res.json({ message: "Phone berhasil dihapus" });
    } catch (err) {
        console.error("Error deleting phone:", err);
        res.status(500).json({ message: "Gagal menghapus phone", error: err.message });
    }
};

// Get unique models for dropdown
exports.getModels = async (req, res) => {
    try {
        const phones = await TradeInPhone.findAll({
            where: { is_active: true },
            attributes: ["model"],
            group: ["model"],
            order: [["model", "ASC"]],
        });

        const models = phones.map((p) => p.model);
        res.json({ models });
    } catch (err) {
        console.error("Error fetching models:", err);
        res.status(500).json({ message: "Gagal mengambil models", error: err.message });
    }
};

// Get categories for specific model
exports.getCategoriesByModel = async (req, res) => {
    try {
        const { model } = req.params;
        const phones = await TradeInPhone.findAll({
            where: { model, is_active: true },
            attributes: ["category", "price_min", "price_max"],
            order: [["category", "ASC"]],
        });

        res.json({ categories: phones });
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Gagal mengambil categories", error: err.message });
    }
};
