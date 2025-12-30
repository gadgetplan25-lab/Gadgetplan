const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyAuthController = require("../controllers/verifyAuthController");
const authMiddleware = require("../middleware/authMiddleware");
const { verifyRefreshToken } = require("../utils/tokenUtils");

router.post("/register", authMiddleware.validateRegister, authController.register);
router.post("/verify-register-otp", verifyAuthController.verifyRegisterOTP);
router.post("/resend-otp-register", authController.resendOtp);
router.post("/refresh-token", verifyRefreshToken, authController.refreshToken);

router.post("/login", authMiddleware.validateLogin, authController.login);
router.post("/verify-login-otp", verifyAuthController.verifyLoginOTP);
router.post("/resend-login-otp", authController.resendLoginOtp);

router.post("/check-email", authController.checkEmail);

router.post("/logout", authController.logout);

router.get("/me", authMiddleware.verifyToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;