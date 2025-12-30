-- SQL Script untuk membuat tabel baru yang diperlukan
-- Run di phpMyAdmin atau MySQL CLI

-- ============================================
-- WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS Wishlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

-- ============================================
-- PRODUCT REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ProductReviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  order_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_product_review (user_id, product_id, order_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Wishlist indexes
CREATE INDEX idx_wishlists_user_id ON Wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON Wishlists(product_id);

-- Product Reviews indexes
CREATE INDEX idx_reviews_product_id ON ProductReviews(product_id);
CREATE INDEX idx_reviews_user_id ON ProductReviews(user_id);
CREATE INDEX idx_reviews_rating ON ProductReviews(rating);

-- ============================================
-- VERIFY TABLES
-- ============================================
SHOW TABLES LIKE '%Wishlist%';
SHOW TABLES LIKE '%Review%';

-- ============================================
-- CHECK TABLE STRUCTURE
-- ============================================
DESCRIBE Wishlists;
DESCRIBE ProductReviews;
