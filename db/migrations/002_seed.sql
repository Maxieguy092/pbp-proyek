-- 002_seed.sql
-- Seed data awal untuk kategori, produk contoh, varian, dan akun admin

USE mini_commerce;

-- Insert categories
INSERT INTO categories (name) VALUES
('Shirts'),
('T-Shirts'),
('Pants'),
('Outerwear');

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, is_active)
VALUES
('Oxford Shirt', 'Kemeja oxford bahan katun premium', 199000, 1, 'imgs/oxford-shirt.jpg', 1),
('Basic Tee', 'Kaos polos nyaman dipakai sehari-hari', 99000, 2, 'imgs/basic-tee.jpg', 1),
('Slim Fit Pants', 'Celana slim fit bahan twill stretch', 249000, 3, 'imgs/slimfit-pants.jpg', 1),
('Denim Jacket', 'Jaket denim klasik warna biru', 349000, 4, 'imgs/denim-jacket.jpg', 1);

-- Insert sample product variants (size, color, stock)
-- Oxford Shirt
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
(1, 'M', 'White', 'OXF-WHT-M', 10),
(1, 'L', 'White', 'OXF-WHT-L', 8);

-- Basic Tee
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
(2, 'M', 'Black', 'TEE-BLK-M', 20),
(2, 'L', 'Black', 'TEE-BLK-L', 15);

-- Slim Fit Pants
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
(3, '32', 'Navy', 'PNT-NVY-32', 12),
(3, '34', 'Navy', 'PNT-NVY-34', 10);

-- Denim Jacket
INSERT INTO product_variants (product_id, size, color, sku, stock) VALUES
(4, 'M', 'Blue', 'DJ-BLU-M', 5),
(4, 'L', 'Blue', 'DJ-BLU-L', 7);

-- Insert sample admin user
-- password = admin123
INSERT INTO users (name, email, password_hash, role, phone, address_default)
VALUES (
  'Admin',
  'admin@example.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  '08123456789',
  'Jl. Contoh No. 1, Semarang'
);
