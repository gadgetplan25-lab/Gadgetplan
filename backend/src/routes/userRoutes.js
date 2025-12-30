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

// Proxy RajaOngkir: Provinsi
router.get("/rajaongkir/province", async (req, res) => {
  try {
    const search = req.query.search || "";
    const response = await axios.get(
      `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?type=province&search=${encodeURIComponent(search)}`,
      { headers: { key: process.env.RAJAONGKIR_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Gagal fetch provinsi RajaOngkir:", err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ message: "Gagal fetch provinsi RajaOngkir", error: err.message, details: err.response?.data });
  }
});

// Proxy RajaOngkir: Kota/Kabupaten
router.get("/rajaongkir/city", async (req, res) => {
  try {
    const { province, search } = req.query;
    const response = await axios.get(
      `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?type=city&province=${encodeURIComponent(province)}&search=${encodeURIComponent(search || "")}`,
      { headers: { key: process.env.RAJAONGKIR_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Gagal fetch kota RajaOngkir:", err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ message: "Gagal fetch kota RajaOngkir", error: err.message, details: err.response?.data });
  }
});

// Proxy RajaOngkir: Kecamatan (Subdistrict)
router.get("/rajaongkir/subdistrict", async (req, res) => {
  try {
    const { city, search } = req.query;
    if (!city) return res.status(400).json({ message: "City ID is required" });

    const response = await axios.get(
      `https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?type=subdistrict&city=${encodeURIComponent(city)}&search=${encodeURIComponent(search || "")}`,
      { headers: { key: process.env.RAJAONGKIR_API_KEY } }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Gagal fetch kecamatan RajaOngkir:", err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ message: "Gagal fetch kecamatan RajaOngkir", error: err.message, details: err.response?.data });
  }
});

module.exports = router;