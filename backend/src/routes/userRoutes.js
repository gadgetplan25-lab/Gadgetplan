const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const technicianController = require("../controllers/technicianController");
const serviceController = require("../controllers/serviceController")
const categoryController = require("../controllers/categoryController");
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
// CSRF Protection removed
const axios = require("axios");

router.get("/products", productController.getAllProducts);
router.get("/filter/by-tag", productController.getProductsByTag);
router.get("/products/:id", productController.getProductById);
router.get("/products/filter/by-tags", productController.filterByTags);
router.get("/filter/by-category", productController.getProductsByCategory);
router.get("/products/filter/by-color", productController.filterByColor);
router.get("/products/filter/by-storage", productController.filterByStorage);
router.get("/products/filter", productController.filterProducts);

// service types
router.get("/service", serviceController.getAllServiceTypes);

// Technicians
router.get("/technicians", technicianController.getTechnicians);

// Category
router.get("/categories", categoryController.getCategories);
router.get("/categories/:id", categoryController.getCategoryById);

// User Profile & Address
router.get("/profile", verifyToken, userController.getProfile);
router.put("/address", verifyToken, userController.updateAddress);

// Full Profile & Orders
router.get("/profile/details", verifyToken, userController.getFullProfile);
router.get("/orders", verifyToken, userController.getUserOrders);
router.get("/orders/:id", verifyToken, userController.getOrderDetails); // New route
router.put("/settings", verifyToken, userController.updateSettings);
router.put("/orders/:id/complete", verifyToken, userController.completeOrder);
router.put("/orders/:id/cancel", verifyToken, userController.cancelOrder);

// RajaOngkir routes removed - using static data on frontend

module.exports = router;