const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More lenient in development
    message: 'Terlalu banyak request dari IP ini, silakan coba lagi nanti.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 5 : 50, // More lenient in development
    message: 'Terlalu banyak percobaan login/register. Silakan coba lagi setelah 15 menit.',
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Limiter for OTP requests
const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 OTP requests per hour
    message: 'Terlalu banyak permintaan OTP. Silakan coba lagi setelah 1 jam.',
});

// Limiter for payment/checkout
const checkoutLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 checkout attempts per minute
    message: 'Terlalu banyak percobaan checkout. Silakan tunggu sebentar.',
});

// Limiter for file uploads
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 uploads per hour
    message: 'Terlalu banyak upload. Silakan coba lagi setelah 1 jam.',
});

// Limiter for webhooks (more lenient for payment providers)
const webhookLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Allow 30 webhook calls per minute
    message: 'Terlalu banyak webhook requests.',
});

module.exports = {
    generalLimiter,
    authLimiter,
    otpLimiter,
    checkoutLimiter,
    uploadLimiter,
    webhookLimiter
};
