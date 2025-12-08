-- CREATE DATABASE IF NOT EXISTS event_booking;
-- USE event_booking;

CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date DATETIME NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  img VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(10, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Safely add columns if they don't exist (for existing databases)
-- Note: MySQL does not support "IF NOT EXISTS" in ALTER TABLE ADD COLUMN directly in all versions easily in one line without a procedure, 
-- but we will append these commands. If they fail because columns exist, it might error, but for this setup script it's a trade-off.
-- Ideally, we'd check information_schema.
-- For simplicity in this dev environment, we assume the user might drop/re-create or these will run.
-- Actually, a better approach for this environment is just to define them in CREATE. 
-- If the user wants to migrate, they can run:
-- ALTER TABLE events ADD COLUMN latitude DECIMAL(10, 8);
-- ALTER TABLE events ADD COLUMN longitude DECIMAL(10, 8);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20),
  quantity INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
