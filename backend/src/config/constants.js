module.exports = {
  // Product & Order Constants
  DEFAULT_PRODUCT_WEIGHT: 1000, // 1kg in grams
  MIN_ORDER_QUANTITY: 1,
  MAX_ORDER_QUANTITY: 100,

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Time related
  OTP_EXPIRY_MINUTES: 10,
  TOKEN_EXPIRY: '7d',
  REFRESH_TOKEN_EXPIRY: '30d',
  UNVERIFIED_USER_CLEANUP_MINUTES: 15,

  // Order Auto-complete (days)
  ORDER_AUTO_COMPLETE_DAYS: 7,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  AUTH_RATE_LIMIT_MAX: 5, // per 15 minutes
  WEBHOOK_RATE_LIMIT_MAX: 30, // per minute
  UPLOAD_RATE_LIMIT_MAX: 20, // per hour

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  // Shipping
  WEEKS_IN_MONTH: 4,
  DEFAULT_COURIER: 'jne',

  // Status Constants
  ORDER_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  },

  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  USER_ROLES: {
    ADMIN: 'admin',
    CUSTOMER: 'customer'
  },

  // Error Messages
  ERROR_MESSAGES: {
    INVALID_TOKEN: 'Invalid or expired token',
    ACCESS_DENIED: 'Access denied',
    USER_NOT_FOUND: 'User not found',
    PRODUCT_NOT_FOUND: 'Product not found',
    INSUFFICIENT_STOCK: 'Insufficient stock',
    INVALID_ORDER_STATUS: 'Invalid order status',
    PAYMENT_FAILED: 'Payment failed',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already registered',
    INVALID_OTP: 'Invalid or expired OTP',
    SERVER_ERROR: 'Internal server error'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    OTP_SENT: 'OTP sent to your email',
    ORDER_CREATED: 'Order created successfully',
    PAYMENT_SUCCESS: 'Payment successful',
    PROFILE_UPDATED: 'Profile updated successfully',
    PASSWORD_CHANGED: 'Password changed successfully'
  },

  // Email Templates
  EMAIL_TEMPLATES: {
    WELCOME_SUBJECT: 'Welcome to Gadget Plan',
    OTP_SUBJECT: 'Your OTP Verification Code',
    ORDER_CONFIRMATION_SUBJECT: 'Order Confirmation',
    PAYMENT_RECEIVED_SUBJECT: 'Payment Received',
    ORDER_SHIPPED_SUBJECT: 'Your Order Has Been Shipped'
  },

  // WhatsApp Messages
  WA_MESSAGES: {
    NEW_ORDER_NOTIFICATION: (orderId, customerName, total) =>
      `🔔 *Order Baru!*\\n\\nOrder ID: #${orderId}\\nCustomer: ${customerName}\\nTotal: Rp ${total}\\nStatus: Menunggu Pembayaran`,
    PAYMENT_CONFIRMATION: (orderId) =>
      `✅ *Payment Confirmed!*\\n\\nOrder ID: #${orderId}\\nStatus: Pembayaran Berhasil\\n\\nPesanan sedang diproses.`,
    ORDER_SHIPPED: (orderId, resi) =>
      `📦 *Order Shipped!*\\n\\nOrder ID: #${orderId}\\nNo. Resi: ${resi}\\n\\nPesanan sedang dalam perjalanan.`
  },

  // Validation Rules
  VALIDATION_RULES: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 100,
    ADDRESS_MAX_LENGTH: 255,
    PHONE_MAX_LENGTH: 20,
    PRODUCT_NAME_MAX_LENGTH: 100,
    PRODUCT_DESC_MAX_LENGTH: 2000,
    REVIEW_MIN_RATING: 1,
    REVIEW_MAX_RATING: 5,
    REVIEW_MAX_LENGTH: 1000
  },

  // Database
  DB_CONFIG: {
    CONNECTION_POOL_MAX: 10,
    CONNECTION_POOL_MIN: 0,
    CONNECTION_ACQUIRE_TIMEOUT: 30000,
    CONNECTION_IDLE_TIMEOUT: 10000,
    RETRY_MAX_ATTEMPTS: 3,
    RETRY_TIMEOUT: 30000
  }
};