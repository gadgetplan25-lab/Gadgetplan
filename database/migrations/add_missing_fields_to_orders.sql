-- Migration: Add missing shipping and payment fields to orders table

ALTER TABLE `orders` 
ADD COLUMN `payment_method` VARCHAR(50) NULL AFTER `total_price`,
ADD COLUMN `shipping_detail` TEXT NULL AFTER `shipping_cost`;
