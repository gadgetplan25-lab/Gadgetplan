const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middleware/authMiddleware");
// CSRF Protection removed

router.use(verifyToken);


router.get("/", cartController.getCart);
router.post("/add", cartController.addItem);
router.put("/update/:cartItemId", cartController.updateItem);
router.delete("/remove/:cartItemId", cartController.removeItem);
router.post("/checkout", cartController.checkout);

module.exports = router;