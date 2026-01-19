const express = require("express");
const router = express.Router();
const controller = require("../controllers/tradeInTemplateController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// ===== PUBLIC ROUTES (User Frontend) =====

// Get all models for dropdown
router.get("/models", controller.getModels);

// Get categories for specific model
router.get("/models/:model/categories", controller.getCategoriesByModel);

// Get deductions for specific phone (model + category)
router.get("/phones/:model/:category/deductions", controller.getPhoneDeductions);

// Get all phones (for user selection)
router.get("/phones", controller.getAllPhones);

// ===== ADMIN ROUTES =====

// Templates
router.get("/admin/templates", verifyToken, verifyAdmin, controller.getAllTemplates);
router.get("/admin/templates/:id", verifyToken, verifyAdmin, controller.getTemplateById);
router.post("/admin/templates", verifyToken, verifyAdmin, controller.createTemplate);
router.put("/admin/templates/:id", verifyToken, verifyAdmin, controller.updateTemplate);
router.delete("/admin/templates/:id", verifyToken, verifyAdmin, controller.deleteTemplate);

// Phones
router.get("/admin/phones", verifyToken, verifyAdmin, controller.getAllPhones);
router.get("/admin/phones/:id", verifyToken, verifyAdmin, controller.getPhoneById);
router.post("/admin/phones", verifyToken, verifyAdmin, controller.createPhone);
router.post("/admin/phones/bulk", verifyToken, verifyAdmin, controller.bulkCreatePhones);
router.put("/admin/phones/:id", verifyToken, verifyAdmin, controller.updatePhone);
router.delete("/admin/phones/:id", verifyToken, verifyAdmin, controller.deletePhone);

module.exports = router;
