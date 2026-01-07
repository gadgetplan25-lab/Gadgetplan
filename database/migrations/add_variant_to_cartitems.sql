-- Migration: Add variant_id to cartitems table
-- Run this migration to support product variants in cart

ALTER TABLE cartitems
ADD COLUMN variant_id INT NULL AFTER storage_id,
ADD CONSTRAINT fk_cartitem_variant
  FOREIGN KEY (variant_id)
  REFERENCES product_variants(id)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_cartitems_variant_id ON cartitems(variant_id);
