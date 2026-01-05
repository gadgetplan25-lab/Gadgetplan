require('dotenv').config();
const { validateEnv } = require('./config/validateEnv');

// Validate environment variables FIRST
validateEnv();

require("./jobs/cleanupUnverifiedUsers");
require("./jobs/autoCompleteOrders");
const express = require('express');
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const { generalLimiter, authLimiter, otpLimiter, checkoutLimiter, uploadLimiter, webhookLimiter } = require('./middleware/rateLimiter');

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authroutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const orderRoutes = require("./routes/checkoutRoute");
const cartRoutes = require("./routes/cartRoutes");
const blogRoutes = require("./routes/blogRoutes");
const tagRoutes = require("./routes/tagRoutes");
const colorRoutes = require("./routes/colorRoutes");
const storageRoutes = require("./routes/storageRoutes");
const wishlistReviewRoutes = require("./routes/wishlistReviewRoutes");


const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false, // Allow CORS
}));

// Apply CORS globally before other routes
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3003',
      // Local development
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3003',
      'https://localhost:3000',
      'https://localhost:3001',
      'https://localhost:3002',
      'https://localhost:3003',
      'https://127.0.0.1:3000',
      'https://127.0.0.1:3001',
      'https://127.0.0.1:3002',
      'https://127.0.0.1:3003',
      // Production domains
      'https://gadgetplan.id',
      'https://www.gadgetplan.id',
      'http://gadgetplan.id',
      'http://www.gadgetplan.id',
      'https://api.gadgetplan.id',
      'http://api.gadgetplan.id'
    ];

    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const isLocalNetwork = origin && (
      origin.startsWith('http://10.') ||
      origin.startsWith('http://192.168.') ||
      origin.startsWith('http://172.')
    );

    if (allowedOrigins.includes(origin) || (process.env.NODE_ENV === 'development' && isLocalNetwork)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ CORS blocked origin: ${origin}`);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-csrf-token",
    "ngrok-skip-browser-warning",
    "X-Requested-With"
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

const staticPath = path.join(__dirname, "..", "public");
app.use(
  "/public",
  express.static(staticPath)
);


app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser());

// Add request ID for tracking
app.use((req, res, next) => {
  req.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Apply rate limiting
app.use(generalLimiter);

// Development-only logging
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.id}] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
  });
}

// Health check routes (no rate limit, no auth)
app.use("/api", healthRoutes);

// Apply auth rate limiting to auth routes
app.use("/api/auth", authLimiter, authRoutes);

// Admin routes (Protected by auth middleware internally)
app.use("/api/admin", adminRoutes);

app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/order", checkoutLimiter, orderRoutes);

// Webhook endpoint with webhook rate limit
app.use("/api/cart", cartRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/storages", storageRoutes);
app.use("/api/user", wishlistReviewRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server started successfully`);
  console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Time: ${new Date().toISOString()}\n`);
});