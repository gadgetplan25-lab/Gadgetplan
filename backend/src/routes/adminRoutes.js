const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");
const categoryController = require("../controllers/categoryController");
const serviceController = require("../controllers/serviceController");
const technicianController = require("../controllers/technicianController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
// CSRF Protection removed
const upload = require("../middleware/upload");
const uploadTechnician = require("../middleware/uploadTechnician");

// Debug: pastikan semua handler adalah function
console.log(
  "verifyToken:", typeof verifyToken,
  "verifyAdmin:", typeof verifyAdmin,
  "csrfProtection:", typeof
"addTechnician:", typeof adminController.addTechnician
);

// Users
router.post("/add", verifyToken, verifyAdmin, adminController.addTechnician);
router.get("/users", verifyToken, verifyAdmin, adminController.getAllUsers);
router.put("/user/:id/role", verifyToken, verifyAdmin, adminController.updateUserRole);
router.delete("/user/:id", verifyToken, verifyAdmin, adminController.deleteUser);

// Products
router.put("/product/:id", verifyToken, verifyAdmin, upload.array("images", 10), productController.updateProduct);
router.post("/product", verifyToken, verifyAdmin, upload.array("images", 10), productController.addProduct);
router.get("/products", verifyToken, verifyAdmin, productController.getAllProducts);
router.delete("/product/:id", verifyToken, verifyAdmin, productController.deleteProduct);

// Categories
router.post("/category", verifyToken, verifyAdmin, categoryController.addCategory);
router.get("/categories", verifyToken, verifyAdmin, categoryController.getCategories);
router.put("/category/:id", verifyToken, verifyAdmin, categoryController.updateCategory);
router.delete("/category/:id", verifyToken, verifyAdmin, categoryController.deleteCategory);

// Service types
router.get("/service", verifyToken, verifyAdmin, serviceController.getAllServiceTypes);
router.post("/service", verifyToken, verifyAdmin, serviceController.addServiceType);
router.put("/service/:id", verifyToken, verifyAdmin, serviceController.updateServiceType);
router.delete("/service/:id", verifyToken, verifyAdmin, serviceController.deleteServiceType);

// Technicians
router.post("/technician", verifyToken, verifyAdmin, uploadTechnician.single("photo"), technicianController.addTechnician);
router.get("/technicians", verifyToken, verifyAdmin, technicianController.getTechnicians);
router.put("/technician/:id", verifyToken, verifyAdmin, uploadTechnician.single("photo"), technicianController.updateTechnician);
router.delete("/technician/:id", verifyToken, verifyAdmin, technicianController.deleteTechnician);

// Booking & Order untuk admin
router.get("/bookings", verifyToken, verifyAdmin, adminController.getAllBookings);
router.get("/orders", verifyToken, verifyAdmin, adminController.getAllOrders);
router.put("/orders/:id/status", verifyToken, verifyAdmin, adminController.updateOrderStatus);

router.get("/dashboard/orders", verifyToken, verifyAdmin, adminController.getDashboardOrders);
router.get("/dashboard/bookings", verifyToken, verifyAdmin, adminController.getDashboardBookings);
router.get("/dashboard/stats", verifyToken, verifyAdmin, adminController.getDashboardStats);

// TEMPORARY RESET ROUTE
router.post("/reset-data", adminController.resetData);

module.exports = router;