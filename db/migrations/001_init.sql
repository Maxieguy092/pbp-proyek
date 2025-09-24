-- 001_init.sql
-- Initial schema and tables for Mini Commerce
-- Charset & timezone
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS mini_commerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mini_commerce;

-- Users
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  phone VARCHAR(30),
  address_default TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Categories
CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_active TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_category_name (name)
) ENGINE=InnoDB;

-- Products
CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  category_id BIGINT UNSIGNED,
  image_url VARCHAR(255),
  is_active TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  KEY idx_products_name (name),
  KEY idx_products_category (category_id),
  KEY idx_products_active (is_active)
) ENGINE=InnoDB;

-- Product Variants (size, color)
CREATE TABLE product_variants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  product_id BIGINT UNSIGNED NOT NULL,
  size VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  sku VARCHAR(100),
  price_override DECIMAL(12,2) DEFAULT NULL,
  stock INT NOT NULL DEFAULT 0,
  is_active TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_variants_product FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  UNIQUE KEY uq_variant_unique (product_id, size, color),
  KEY idx_variant_product (product_id)
) ENGINE=InnoDB;

-- Carts
CREATE TABLE carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  is_active TINYINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  KEY idx_carts_user_active (user_id, is_active)
) ENGINE=InnoDB;

-- Cart Items
CREATE TABLE cart_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cart_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  product_variant_id BIGINT UNSIGNED,
  qty INT NOT NULL CHECK (qty > 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id)
    REFERENCES carts(id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_cart_items_variant FOREIGN KEY (product_variant_id)
    REFERENCES product_variants(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  KEY idx_cart_items_cart (cart_id),
  KEY idx_cart_items_variant (product_variant_id)
) ENGINE=InnoDB;

-- Orders
CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  status ENUM('unpaid','paid','processed','shipped','completed','canceled')
         NOT NULL DEFAULT 'unpaid',
  payment_method ENUM('transfer','cod','ewallet','virtual_account') NOT NULL,
  ship_name VARCHAR(100) NOT NULL,
  ship_phone VARCHAR(30),
  ship_address TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  KEY idx_orders_user (user_id, created_at),
  KEY idx_orders_status (status)
) ENGINE=InnoDB;

-- Order Items
CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  product_variant_id BIGINT UNSIGNED,
  price_final DECIMAL(12,2) NOT NULL,
  qty INT NOT NULL CHECK (qty > 0),
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT fk_order_items_variant FOREIGN KEY (product_variant_id)
    REFERENCES product_variants(id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  KEY idx_order_items_order (order_id)
) ENGINE=InnoDB;
