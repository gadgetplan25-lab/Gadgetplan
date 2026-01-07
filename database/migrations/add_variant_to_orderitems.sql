-- Migration: Add variant_id to orderitems table
-- Run this SQL in your MySQL database

ALTER TABLE `orderitems` 
ADD COLUMN `variant_id` INT NULL AFTER `product_id`,
ADD INDEX `variant_id_idx` (`variant_id`),
ADD CONSTRAINT `fk_orderitem_variant` 
  FOREIGN KEY (`variant_id`) 
  REFERENCES `product_variants` (`id`) 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;
