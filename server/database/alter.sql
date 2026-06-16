USE slrros;

ALTER TABLE orders
  ADD COLUMN tracking_code VARCHAR(20) UNIQUE,
  ADD COLUMN source_warehouse_id INT,
  ADD COLUMN dest_warehouse_id INT,
  ADD COLUMN vehicle_id INT,
  ADD COLUMN status ENUM('placed','verified','packed','dispatched','in_transit','delivered') DEFAULT 'placed',
  ADD COLUMN progress_pct FLOAT DEFAULT 0,
  ADD CONSTRAINT fk_order_source FOREIGN KEY (source_warehouse_id) REFERENCES warehouses(id),
  ADD CONSTRAINT fk_order_dest   FOREIGN KEY (dest_warehouse_id)   REFERENCES warehouses(id),
  ADD CONSTRAINT fk_order_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id);

-- Insert dummy tracked orders
INSERT INTO orders (customer_name, budget, tracking_code, source_warehouse_id, dest_warehouse_id, vehicle_id, status, progress_pct)
VALUES 
('Asha Rao', 2000, 'SLR-2026-0042', 1, 6, 1, 'in_transit', 42),
('Vikram Singh', 500, 'SLR-2026-0043', 2, 8, 1, 'placed', 0),
('Priya Patel', 1200, 'SLR-2026-0044', 5, 3, 1, 'packed', 0);
