const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public health check endpoints
router.get('/health', healthController.healthCheck);
router.get('/ping', healthController.ping);

// Admin only - detailed system info
router.get('/system', verifyToken, verifyAdmin, healthController.systemInfo);

module.exports = router;
