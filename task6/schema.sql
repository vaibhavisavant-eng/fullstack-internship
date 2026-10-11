-- ==========================================================================
-- Task 6 — Full Stack User Management System Database Initialization
-- ==========================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS `fullstack_user_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `fullstack_user_db`;

-- 2. Drop existing table for clean re-initialization
DROP TABLE IF EXISTS `users`;

-- 3. Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `age` INT NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'User',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Seed Default Admin & Users
-- Note: Passwords below are hashed using bcrypt (default password for all seed users is "Password123!")
INSERT INTO `users` (`name`, `email`, `age`, `password`, `role`) VALUES
('Admin User', 'admin@example.com', 30, '$2a$10$7R4dF3yY5W9K1uM.g/ZJXe1l6z6yH1xK5uL8vP7mN9qO2wE3rT4uS', 'Admin'),
('Alice Johnson', 'alice@example.com', 28, '$2a$10$7R4dF3yY5W9K1uM.g/ZJXe1l6z6yH1xK5uL8vP7mN9qO2wE3rT4uS', 'User'),
('Bob Smith', 'bob@example.com', 34, '$2a$10$7R4dF3yY5W9K1uM.g/ZJXe1l6z6yH1xK5uL8vP7mN9qO2wE3rT4uS', 'User'),
('Charlie Davis', 'charlie@example.com', 22, '$2a$10$7R4dF3yY5W9K1uM.g/ZJXe1l6z6yH1xK5uL8vP7mN9qO2wE3rT4uS', 'User');
