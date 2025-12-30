const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_default';
const JWT_EXPIRES_IN = "15m";
const crypto = require("crypto");

// Generate CSRF token (kept for backward compatibility)
exports.generateCsrfToken = () => {
  return crypto.randomBytes(24).toString("hex");
};

// Middleware to validate CSRF token - DISABLED
exports.csrfProtection = (req, res, next) => {
  // CSRF protection disabled - always allow
  next();
};

const JWT_REFRESH_EXPIRES_IN = "7d";

// Generate tokens
exports.generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
  return { accessToken, refreshToken };
};

// Middleware to verify refresh token
exports.verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token tidak ada" });
  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Refresh token tidak valid" });
    req.user = decoded;
    next();
  });
};
