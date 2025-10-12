-- Pesanan Pertama (dari user id=2)
INSERT INTO orders (id, user_id, total, status, address_text, created_at) 
VALUES (
    1, 
    2, 
    617000.00, 
    'Processing', 
    '{ "name": "Alice Wonderland", "street": "Jalan Pahlawan No. 123", "district": "Semarang Selatan", "city": "Kota Semarang", "province": "Jawa Tengah", "postal": "50241", "phone": "081234567890" }', 
    '2025-09-28 10:30:00'
);

-- Pesanan Kedua (dari user id=3)
INSERT INTO orders (id, user_id, total, status, address_text, created_at) 
VALUES (
    2, 
    3, 
    598000.00, 
    'Delivering', 
    '{ "name": "Bob Builder", "street": "Jalan Gajah Mada No. 45", "district": "Semarang Tengah", "city": "Kota Semarang", "province": "Jawa Tengah", "postal": "50134", "phone": "087654321098" }', 
    '2025-09-27 15:00:00'
);


-- =================================================================
-- ISI ITEM UNTUK SETIAP PESANAN
-- =================================================================

-- Item untuk Pesanan ID = 1
INSERT INTO order_items (order_id, product_id, price, qty, subtotal) VALUES
(1, 1, 159000.00, 2, 318000.00),
(1, 9, 299000.00, 1, 299000.00);

-- Item untuk Pesanan ID = 2
INSERT INTO order_items (order_id, product_id, price, qty, subtotal) VALUES
(2, 3, 179000.00, 2, 358000.00),
(2, 1, 159000.00, 1, 159000.00);