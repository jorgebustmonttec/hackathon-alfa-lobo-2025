/* V3: Correct schema, add user/logging, and support direction-specific configs */

/* 1. User Table */
CREATE TABLE app_user (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords, not plaintext
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

/* 2. Replenishment Logging Tables */
CREATE TABLE replenishment_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trolley_id UUID NOT NULL REFERENCES trolley(trolley_id),
    user_id UUID NOT NULL REFERENCES app_user(user_id),
    flight_route_id UUID NOT NULL REFERENCES flight_route(flight_route_id),
    location_code VARCHAR(10) NOT NULL, -- e.g., 'DFW' or 'LHR'
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE replenishment_log_detail (
    log_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_id UUID NOT NULL REFERENCES replenishment_log(log_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES product(product_id),
    position_identifier VARCHAR(50) NOT NULL, -- e.g., 'Slot-1A'
    expected_quantity INT NOT NULL,
    counted_quantity INT NOT NULL
);

/* 3. Correct the core schema relationship */

-- Drop the incorrect linker table from V2
DROP TABLE flight_route_trolley;

-- Alter the trolley table to be the central point of the relationship
-- It now belongs to a flight and holds its two directional configs.
ALTER TABLE trolley
    DROP COLUMN trolley_config_id, -- This was incorrect, a trolley has two configs.
    ADD COLUMN flight_route_id UUID REFERENCES flight_route(flight_route_id),
    ADD COLUMN origin_trolley_config_id UUID REFERENCES trolley_config(trolley_config_id),
    ADD COLUMN destination_trolley_config_id UUID REFERENCES trolley_config(trolley_config_id);


/* 4. Add/Update Sample Data for New/Modified Tables */

-- Add a test user
INSERT INTO app_user (user_id, username, password_hash) VALUES
('e1e1e1e1-5555-5555-5555-000000000001', 'donpepe', 'some_strong_hash_here');

-- Create a second trolley config for the return flight
INSERT INTO trolley_config (trolley_config_id, name) VALUES
('c1c1c1c1-3333-3333-3333-000000000002', 'Economy Snack/Drink Trolley (Return Leg)');

-- Update the existing trolleys to link them to a flight route and assign their two configs.
-- Both trolleys belong to flight AA123.
-- When departing from origin (DFW), they use the 'Half-Size' config.
-- When departing from destination (LHR), they use the 'Return Leg' config.
UPDATE trolley
SET
    flight_route_id = 'd1d1d1d1-4444-4444-4444-000000000001',
    origin_trolley_config_id = 'c1c1c1c1-3333-3333-3333-000000000001',
    destination_trolley_config_id = 'c1c1c1c1-3333-3333-3333-000000000002'
WHERE trolley_qr_id IN ('GATE-TROLLEY-001', 'GATE-TROLLEY-002');