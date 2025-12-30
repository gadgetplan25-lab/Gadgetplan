const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");



exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token tidak ada" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token tidak valid" });
    req.user = decoded;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses ditolak, hanya admin" });
  }
  next();
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Admin only" });
};

exports.validateRegister = [
  body("email").isEmail().withMessage("Format email tidak valid"),
  body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
  body("name").notEmpty().withMessage("Nama wajib diisi"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
exports.validateLogin = [
  body("email").isEmail().withMessage("Format email tidak valid"),
  body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];