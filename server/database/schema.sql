CREATE DATABASE IF NOT EXISTS slrros;
USE slrros;

CREATE TABLE warehouses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  pos_x FLOAT NOT NULL,
  pos_y FLOAT NOT NULL
);

CREATE TABLE roads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_id INT NOT NULL,
  to_id INT NOT NULL,
  distance FLOAT NOT NULL,
  cost FLOAT NOT NULL,
  FOREIGN KEY (from_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (to_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE TABLE vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  capacity_weight FLOAT NOT NULL
);

CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  weight FLOAT NOT NULL,
  value FLOAT NOT NULL,
  destination_warehouse_id INT,
  FOREIGN KEY (destination_warehouse_id) REFERENCES warehouses(id)
);

CREATE TABLE vehicle_cargo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehicle_id INT NOT NULL,
  package_id INT NOT NULL,
  selected BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  weight FLOAT NOT NULL,
  value FLOAT NOT NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE task_edges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_task_id INT NOT NULL,
  to_task_id INT NOT NULL,
  FOREIGN KEY (from_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (to_task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  budget FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  price FLOAT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE benchmark_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  algorithm_name VARCHAR(50) NOT NULL,
  dataset_size INT NOT NULL,
  comparisons INT,
  swaps INT,
  time_ms FLOAT NOT NULL,
  run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','operator') DEFAULT 'operator'
);
