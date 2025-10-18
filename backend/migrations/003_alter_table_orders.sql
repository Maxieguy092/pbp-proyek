ALTER TABLE orders
-- Tambah kolom untuk nama, email, dan telepon penerima
ADD COLUMN shipping_name VARCHAR(100) NOT NULL AFTER total,
ADD COLUMN shipping_email VARCHAR(100) NOT NULL AFTER shipping_name,
ADD COLUMN shipping_phone VARCHAR(20) NOT NULL AFTER shipping_email,

-- Tambah kolom untuk opsi pengiriman & pembayaran
ADD COLUMN shipping_option VARCHAR(50) NOT NULL AFTER status,
ADD COLUMN payment_option VARCHAR(50) NOT NULL AFTER shipping_option,

-- Kolom ini fleksibel untuk menyimpan detail pembayaran
-- Contoh: nomor kartu, nama bank, atau null jika QRIS
ADD COLUMN payment_details TEXT AFTER payment_option;