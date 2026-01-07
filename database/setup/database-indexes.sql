-- Database Indexing for Performance Optimization
-- Run these queries in MySQL/phpMyAdmin

-- ============================================
-- ORDERS TABLE INDEXES
-- ============================================

-- Index on user_id (frequently queried)
CREATE INDEX idx_orders_user_id ON Orders(user_id);

-- Index on status (for filtering orders by status)
CREATE INDEX idx_orders_status ON Orders(status);

-- Composite index for user_id + status (common query pattern)
CREATE INDEX idx_orders_user_status ON Orders(user_id, status);

-- Index on createdAt (for sorting by date)
CREATE INDEX idx_orders_created_at ON Orders(createdAt);

-- ============================================
-- PRODUCTS TABLE INDEXES
-- ============================================

-- Index on category_id (for filtering by category)
CREATE INDEX idx_products_category_id ON Products(category_id);

-- Index on name (for search)
CREATE INDEX idx_products_name ON Products(name);

-- Index on price (for sorting by price)
CREATE INDEX idx_products_price ON Products(price);

-- ============================================
-- CART ITEMS TABLE INDEXES
-- ============================================

-- Index on cart_id (for fetching cart items)
CREATE INDEX idx_cartitems_cart_id ON CartItems(cart_id);

-- Index on product_id (for product lookups)
CREATE INDEX idx_cartitems_product_id ON CartItems(product_id);

-- ============================================
-- PAYMENTS TABLE INDEXES
-- ============================================

-- Index on order_id (for payment lookups)
CREATE INDEX idx_payments_order_id ON Payments(order_id);

-- Index on transaction_id (for webhook lookups)
CREATE INDEX idx_payments_transaction_id ON Payments(transaction_id);

-- Index on status (for filtering payments)
CREATE INDEX idx_payments_status ON Payments(status);

-- ============================================
-- USERS TABLE INDEXES
-- ============================================

-- Index on email (for login - usually already exists as UNIQUE)
-- CREATE INDEX idx_users_email ON Users(email);

-- Index on role (for role-based queries)
CREATE INDEX idx_users_role ON Users(role);

-- Index on isVerified (for filtering verified users)
CREATE INDEX idx_users_is_verified ON Users(isVerified);

-- ============================================
-- ORDER ITEMS TABLE INDEXES
-- ============================================

-- Index on order_id (for fetching order items)
CREATE INDEX idx_orderitems_order_id ON OrderItems(order_id);

-- Index on product_id (for product lookups)
CREATE INDEX idx_orderitems_product_id ON OrderItems(product_id);

-- ============================================
-- BOOKINGS TABLE INDEXES
-- ============================================

-- Index on user_id (for user bookings)
CREATE INDEX idx_bookings_user_id ON Bookings(user_id);

-- Index on status (for filtering bookings)
CREATE INDEX idx_bookings_status ON Bookings(status);

-- Index on service_date (for date-based queries)
CREATE INDEX idx_bookings_service_date ON Bookings(service_date);

-- ============================================
-- OTP TABLE INDEXES
-- ============================================

-- Index on userId (for OTP lookups)
CREATE INDEX idx_otp_user_id ON OTP(userId);

-- Index on expiresAt (for cleanup queries)
CREATE INDEX idx_otp_expires_at ON OTP(expiresAt);

-- ============================================
-- VERIFY INDEXES
-- ============================================

-- Check all indexes
SHOW INDEX FROM Orders;
SHOW INDEX FROM Products;
SHOW INDEX FROM CartItems;
SHOW INDEX FROM Payments;
SHOW INDEX FROM Users;
SHOW INDEX FROM OrderItems;
SHOW INDEX FROM Bookings;
SHOW INDEX FROM OTP;

-- ============================================
-- ANALYZE QUERY PERFORMANCE
-- ============================================

-- Example: Check query execution plan
EXPLAIN SELECT * FROM Orders WHERE user_id = 1 AND status = 'pending';

-- Example: Check slow queries
SHOW FULL PROCESSLIST;

-- ============================================
-- NOTES
-- ============================================

-- 1. Indexes improve SELECT performance but slow down INSERT/UPDATE
-- 2. Don't over-index - only index frequently queried columns
-- 3. Composite indexes are useful for queries with multiple WHERE conditions
-- 4. Monitor query performance with EXPLAIN
-- 5. Rebuild indexes periodically: OPTIMIZE TABLE table_name;

-- ============================================
-- MAINTENANCE
-- ============================================

-- Rebuild all indexes (run periodically)
OPTIMIZE TABLE Orders;
OPTIMIZE TABLE Products;
OPTIMIZE TABLE CartItems;
OPTIMIZE TABLE Payments;
OPTIMIZE TABLE Users;
OPTIMIZE TABLE OrderItems;
OPTIMIZE TABLE Bookings;
OPTIMIZE TABLE OTP;
