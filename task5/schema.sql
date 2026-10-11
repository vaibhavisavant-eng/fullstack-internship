-- ==========================================================================
-- Task 5 — MySQL Database Schema Initialization Script
-- ==========================================================================

-- 1. Create Database if it does not exist
CREATE DATABASE IF NOT EXISTS `user_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 2. Select Database
USE `user_db`;

-- 3. Drop Table if exists (for clean re-initialization)
DROP TABLE IF EXISTS `users`;

-- 4. Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `age` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Insert Sample Seed Records
INSERT INTO `users` (`name`, `email`, `age`) VALUES
('Alice Johnson', 'alice@example.com', 28),
('Bob Smith', 'bob@example.com', 34),
('Charlie Davis', 'charlie@example.com', 22),
('Diana Prince', 'diana@example.com', 30);
