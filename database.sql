-- Database Export for MySQL (Documentation Only)
-- This file provides the SQL structure requested for documentation purposes.
-- The actual application uses Firebase Firestore (NoSQL).

CREATE DATABASE IF NOT EXISTS cloudedit;
USE cloudedit;

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Services Table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2)
);

-- 3. Orders Table
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    customer_name VARCHAR(100),
    customer_email VARCHAR(100),
    whatsapp VARCHAR(20),
    service_name VARCHAR(100),
    package_name VARCHAR(50),
    notes TEXT,
    file_url TEXT,
    result_url TEXT,
    status ENUM('pending', 'processing', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Default Admin Account
-- Password 'admin123' (Hashed versions should be used in production)
INSERT INTO users (id, name, email, password, role) 
VALUES ('ADMIN_UID_1', 'Administrator', 'admin@cloudedit.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Initial Services
INSERT INTO services (name, description, base_price) VALUES 
('Edit Foto', 'Retouch dan grading warna profesional', 50000),
('TikTok / Reels', 'Video vertikal kreatif dengan subtitle', 150000),
('YT Thumbnail', 'Desain klik menarik untuk YouTube', 75000),
('Desain Poster', 'Desain grafis untuk event atau produk', 100000);
