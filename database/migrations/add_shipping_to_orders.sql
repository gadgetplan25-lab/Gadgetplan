-- Migration: Add shipping and payment fields to orders table
-- Run this SQL in your MySQL database

ALTER TABLE `orders` 
ADD COLUMN `payment_method` VARCHAR(50) NULL AFTER `total_price`,
ADD COLUMN `shipping_cost` DECIMAL(10, 2) DEFAULT 0 AFTER `payment_method`,
ADD COLUMN `shipping_detail` TEXT NULL AFTER `shipping_cost`;
