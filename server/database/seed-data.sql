
-- Users
INSERT INTO users (username, password_hash, role) VALUES ('admin', 'hashed_pw_here', 'admin');
INSERT INTO users (username, password_hash, role) VALUES ('operator', 'hashed_pw_here', 'operator');

-- Warehouses
INSERT INTO warehouses (id, name, pos_x, pos_y) VALUES
(1, 'A - Central Hub', 100, 100),
(2, 'B - North Depot', 100, 50),
(3, 'C - East Yard', 200, 100),
(4, 'D - South Store', 100, 200),
(5, 'E - West Point', 20, 100),
(6, 'F - Riverside', 220, 180),
(7, 'G - Hilltop', 60, 30),
(8, 'H - Tech Park', 260, 60),
(9, 'I - Harbor', 280, 130),
(10, 'J - Airport', 40, 210),
(11, 'K - Downtown', 150, 150),
(12, 'L - Suburbs', 250, 20),
(13, 'M - Industrial', 160, 20),
(14, 'N - Outpost', 10, 150),
(15, 'O - Market', 200, 230);

-- Roads
INSERT INTO roads (from_id, to_id, distance, cost) VALUES
(1, 2, 4, 4),
(1, 3, 8, 8),
(1, 4, 6, 6),
(1, 5, 5, 5),
(2, 7, 3, 3),
(3, 6, 7, 7),
(3, 8, 9, 9),
(4, 6, 4, 4),
(5, 7, 2, 2),
(6, 8, 5, 5),
(2, 3, 11, 11),
(4, 5, 10, 10),
(8, 9, 7, 7),
(3, 9, 6, 6),
(6, 15, 4, 4),
(4, 15, 8, 8),
(4, 10, 5, 5),
(5, 14, 4, 4),
(14, 10, 6, 6),
(1, 11, 4, 4),
(11, 6, 5, 5),
(11, 4, 3, 3),
(2, 13, 5, 5),
(13, 12, 8, 8),
(12, 8, 3, 3),
(7, 13, 7, 7);

-- Vehicles
INSERT INTO vehicles (id, name, capacity_weight) VALUES
(1, 'Truck-01', 50);

-- Packages
INSERT INTO packages (name, weight, value, destination_warehouse_id) VALUES
('Electronics Box', 20, 1800, 3),
('Furniture Crate', 30, 1500, 4),
('Grocery Pack', 10, 600, 2),
('Medical Supplies', 15, 2000, 6),
('Books Bundle', 12, 400, 7),
('Clothing Bale', 18, 900, 8);

-- Resources
INSERT INTO resources (name, weight, value) VALUES
('Diesel', 30, 2400),
('Petrol', 20, 1800),
('CNG', 25, 2000),
('Biofuel', 15, 900);

-- Tasks
INSERT INTO tasks (id, name) VALUES
(1, 'Receive Order'),
(2, 'Verify Payment'),
(3, 'Check Inventory'),
(4, 'Package Item'),
(5, 'Assign Vehicle'),
(6, 'Dispatch'),
(7, 'Deliver'),
(8, 'Send Invoice');

-- Task Edges
INSERT INTO task_edges (from_task_id, to_task_id) VALUES
(1, 2),
(1, 3),
(2, 4),
(3, 4),
(4, 5),
(5, 6),
(6, 7),
(7, 8);

-- Orders
INSERT INTO orders (id, customer_name, budget) VALUES
(1, 'John Doe', 1500);

-- Order Items (Prices)
INSERT INTO order_items (order_id, product_name, price) VALUES
(1, 'Product 1', 299),
(1, 'Product 2', 499),
(1, 'Product 3', 999),
(1, 'Product 4', 199),
(1, 'Product 5', 799),
(1, 'Product 6', 1299),
(1, 'Product 7', 599);
