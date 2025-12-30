const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { verifyToken } = require("../middleware/authMiddleware");
// CSRF Protection removed
router.use(verifyToken);

router.post("/shipping/estimate", checkoutController.estimateShipping);
router.post("/checkout",  checkoutController.checkout);

module.exports = router;