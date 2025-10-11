-- =================================================================
-- 002_seed_data.sql
-- File ini mengisi data awal (seeding) ke dalam tabel.
-- Jalankan file ini SETELAH 001_create_tables.sql berhasil.
-- =================================================================

-- Seeding untuk tabel 'categories'
INSERT INTO categories (id, name, created_at) VALUES
(1, 'T-Shirts', '2025-10-10 15:11:59'),
(2, 'Shirts', '2025-10-10 15:11:59'),
(3, 'Pants', '2025-10-10 15:11:59'),
(4, 'Outerwear', '2025-10-10 15:11:59');

-- Seeding untuk tabel 'users'
-- PERINGATAN: Password di bawah ini adalah teks biasa dan tidak aman.
-- Gunakan password hash di aplikasi production.
INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'Admin', 'admin@store.com', 'admin123', 'admin', '2025-10-11 05:22:18'),
(2, 'Alice', 'alice@store.com', 'password1', 'regular', '2025-10-11 05:22:18'),
(3, 'Bob', 'bob@store.com', 'password2', 'regular', '2025-10-11 05:22:18');

-- Seeding untuk tabel 'products'
INSERT INTO products (id, name, price, stock, category_id, is_active, created_at, image_url, images, sizes, description) VALUES
(1, 'Boxy Tee Black', 159000.00, 12, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-1.jpg', '["/images/t-shirts-1.jpg", "/images/t-shirts-1b.jpg", "/images/t-shirts-1c.jpg", "/images/t-shirts-1d.jpg"]', '["S", "M", "L", "XL"]', 'Kaos boxy fit 240gsm, nyaman dipakai harian, warna deep black anti pudar.'),
(2, 'Boxy Tee Cream', 159000.00, 18, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-2.jpg', '["/images/t-shirts-2.jpg", "/images/t-shirts-2b.jpg", "/images/t-shirts-2c.jpg", "/images/t-shirts-2d.jpg"]', '["S", "M", "L", "XL"]', 'Kaos boxy fit tone krem kalem, bahan tebal jatuh dan tidak menerawang.'),
(3, 'Graphic Tee Blue', 179000.00, 9, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-3.jpg', '["/images/t-shirts-3.jpg", "/images/t-shirts-3b.jpg", "/images/t-shirts-3c.jpg", "/images/t-shirts-3d.jpg"]', '["S", "M", "L", "XL"]', 'Graphic tee biru dengan sablon plastisol tajam dan tahan cuci.'),
(4, 'Oversized Tee Grey', 169000.00, 20, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-4.jpg', '["/images/t-shirts-4.jpg", "/images/t-shirts-4b.jpg", "/images/t-shirts-4c.jpg", "/images/t-shirts-4d.jpg"]', '["S", "M", "L", "XL"]', 'Oversized tee abu, cutting loose untuk look santai tapi tetap rapi.'),
(5, 'Vintage Tee Navy', 169000.00, 14, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-5.jpg', '["/images/t-shirts-5.jpg", "/images/t-shirts-5b.jpg", "/images/t-shirts-5c.jpg", "/images/t-shirts-5d.jpg"]', '["S", "M", "L", "XL"]', 'Nuansa vintage navy, treatment washed lembut dan nyaman.'),
(6, 'Rib Tee Cream', 169000.00, 11, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-6.jpg', '["/images/t-shirts-6.jpg", "/images/t-shirts-6b.jpg", "/images/t-shirts-6c.jpg", "/images/t-shirts-6d.jpg"]', '["S", "M", "L", "XL"]', 'Ribbed tee tekstur halus, stretch pas di badan.'),
(7, 'Pocket Tee Olive', 169000.00, 13, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-7.jpg', '["/images/t-shirts-7.jpg", "/images/t-shirts-7b.jpg", "/images/t-shirts-7c.jpg", "/images/t-shirts-7d.jpg"]', '["S", "M", "L", "XL"]', 'Kaos dengan saku dada, warna olive earth-tone yang gampang di-mix.'),
(8, 'Heavyweight Tee', 169000.00, 16, 1, 1, '2025-10-11 05:22:57', '/images/t-shirts-8.jpg', '["/images/t-shirts-8.jpg", "/images/t-shirts-8b.jpg", "/images/t-shirts-8c.jpg", "/images/t-shirts-8d.jpg"]', '["S", "M", "L", "XL"]', 'Heavyweight 260gsm, bentuk tetap rapih setelah banyak pencucian.'),
(9, 'Oxford Shirt Blue', 299000.00, 10, 2, 1, '2025-10-11 05:22:57', '/images/shirt-1.jpg', '["/images/shirt-1.jpg", "/images/shirt-1b.jpg", "/images/shirt-1c.jpg", "/images/shirt-1d.jpg"]', '["S", "M", "L", "XL"]', 'Kemeja oxford biru, tekstur khas dan breathable untuk daily smart look.'),
(10, 'Oxford Shirt White', 299000.00, 8, 2, 1, '2025-10-11 05:22:57', '/images/shirt-2.jpg', '["/images/shirt-2.jpg", "/images/shirt-2b.jpg", "/images/shirt-2c.jpg", "/images/shirt-2d.jpg"]', '["S", "M", "L", "XL"]', 'Kemeja oxford putih versatile, bisa formal atau casual, tidak mudah kusut.'),
(11, 'Linen Shirt Cream', 329000.00, 12, 2, 1, '2025-10-11 05:22:57', '/images/shirt-3.jpg', '["/images/shirt-3.jpg", "/images/shirt-3b.jpg", "/images/shirt-3c.jpg", "/images/shirt-3d.jpg"]', '["S", "M", "L", "XL"]', 'Kemeja linen tone cream natural, airy untuk cuaca tropis.'),
(12, 'Flannel Shirt Red', 279000.00, 9, 2, 1, '2025-10-11 05:22:57', '/images/shirt-4.jpg', '["/images/shirt-4.jpg", "/images/shirt-4b.jpg", "/images/shirt-4c.jpg", "/images/shirt-4d.jpg"]', '["S", "M", "L", "XL"]', 'Flannel motif kotak merah, brushed finish, adem dan nyaman dipakai.'),
(13, 'Chino Slim Khaki', 279000.00, 14, 3, 1, '2025-10-11 05:22:57', '/images/pants-1.jpg', '["/images/pants-1.jpg", "/images/pants-1b.jpg", "/images/pants-1c.jpg", "/images/pants-1d.jpg"]', '["28", "29", "30", "31", "32", "33", "34", "36"]', 'Chino slim fit warna khaki, bahan stretch nyaman gerak.'),
(14, 'Chino Slim Navy', 279000.00, 12, 3, 1, '2025-10-11 05:22:57', '/images/pants-2.jpg', '["/images/pants-2.jpg", "/images/pants-2b.jpg", "/images/pants-2c.jpg", "/images/pants-2d.jpg"]', '["28", "29", "30", "31", "32", "33", "34", "36"]', 'Chino slim navy, gampang dipadu sama sneakers atau loafers.'),
(15, 'Relaxed Cargo Olive', 299000.00, 10, 3, 1, '2025-10-11 05:22:57', '/images/pants-3.jpg', '["/images/pants-3.jpg", "/images/pants-3b.jpg", "/images/pants-3c.jpg", "/images/pants-3d.jpg"]', '["28", "30", "32", "34", "36"]', 'Celana cargo relaxed, banyak kantong fungsional—outdoor friendly.'),
(16, 'Denim Straight Blue', 329000.00, 9, 3, 1, '2025-10-11 05:22:57', '/images/pants-4.jpg', '["/images/pants-4.jpg", "/images/pants-4b.jpg", "/images/pants-4c.jpg", "/images/pants-4d.jpg"]', '["28", "29", "30", "31", "32", "33", "34", "36"]', 'Jeans straight cutting klasik, mid blue wash, tebal tapi tetap fleksibel.'),
(17, 'Coach Jacket Black', 399000.00, 7, 4, 1, '2025-10-11 05:22:57', '/images/outer-1.jpg', '["/images/outer-1.jpg", "/images/outer-1b.jpg", "/images/outer-1c.jpg", "/images/outer-1d.jpg"]', '["S", "M", "L", "XL"]', 'Coach jacket hitam, wind-resistant dengan lining tipis.'),
(18, 'Hoodie Heavy Cream', 329000.00, 15, 4, 1, '2025-10-11 05:22:57', '/images/outer-2.jpg', '["/images/outer-2.jpg", "/images/outer-2b.jpg", "/images/outer-2c.jpg", "/images/outer-2d.jpg"]', '["S", "M", "L", "XL"]', 'Hoodie heavyweight, lembut dalamnya, jatuh bagus dan hangat.'),
(19, 'Windbreaker Navy', 369000.00, 11, 4, 1, '2025-10-11 05:22:57', '/images/outer-3.jpg', '["/images/outer-3.jpg", "/images/outer-3b.jpg", "/images/outer-3c.jpg", "/images/outer-3d.jpg"]', '["S", "M", "L", "XL"]', 'Windbreaker navy ringan, cocok buat commuting dan lari sore.'),
(20, 'Denim Jacket Mid', 449000.00, 6, 4, 1, '2025-10-11 05:22:57', '/images/outer-4.jpg', '["/images/outer-4.jpg", "/images/outer-4b.jpg", "/images/outer-4c.jpg", "/images/outer-4d.jpg"]', '["S", "M", "L", "XL"]', 'Jaket denim mid-wash, build sturdy, cocok layered dengan tee/hoodie.');