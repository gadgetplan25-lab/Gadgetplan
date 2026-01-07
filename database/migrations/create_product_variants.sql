-- Migration: Create product_variants table
-- Run this SQL in your MySQL database

CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NOT NULL,
  `color_id` INT NULL,
  `storage_id` INT NULL,
  `price` DECIMAL(10, 2) NOT NULL COMMENT 'Harga untuk variant ini',
  `stock` INT NOT NULL DEFAULT 0 COMMENT 'Stok untuk variant ini',
  `sku` VARCHAR(255) NULL UNIQUE COMMENT 'SKU unik untuk variant (opsional)',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `product_id_idx` (`product_id`),
  INDEX `color_id_idx` (`color_id`),
  INDEX `storage_id_idx` (`storage_id`),
  CONSTRAINT `fk_variant_product` 
    FOREIGN KEY (`product_id`) 
    REFERENCES `products` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_variant_color` 
    FOREIGN KEY (`color_id`) 
    REFERENCES `colors` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  CONSTRAINT `fk_variant_storage` 
    FOREIGN KEY (`storage_id`) 
    REFERENCES `storages` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add unique constraint untuk prevent duplicate variants
ALTER TABLE `product_variants` 
ADD UNIQUE KEY `unique_variant` (`product_id`, `color_id`, `storage_id`);
