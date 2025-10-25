/* V2: Add base schema for the "Template" configuration */

/* 1. Core "Object" Tables */

CREATE TABLE product (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    barcode VARCHAR(100) UNIQUE, /* Back to one barcode per product */
    description TEXT
);

/* product_barcode table is GONE */

CREATE TABLE basket_config (
    basket_config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE trolley_config (
    trolley_config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

/* Your physical trolley table (GOOD idea) */
CREATE TABLE trolley (
    trolley_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trolley_qr_id VARCHAR(50) NOT NULL UNIQUE, /* The unique, scannable ID, e.g., "T-123" */
    trolley_config_id UUID NOT NULL REFERENCES trolley_config(trolley_config_id) /* What config is this trolley using? */
);

CREATE TABLE flight_route (
    flight_route_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_number VARCHAR(20) NOT NULL UNIQUE, /* e.g., "AA123" */
    origin VARCHAR(10),
    destination VARCHAR(10)
);


/* 2. "Linker" (Join) Tables for Many-to-Many Relationships */

CREATE TABLE basket_config_product (
    basket_config_id UUID REFERENCES basket_config(basket_config_id),
    product_id UUID REFERENCES product(product_id),
    expected_quantity INT NOT NULL CHECK (expected_quantity > 0),
    PRIMARY KEY (basket_config_id, product_id)
);

CREATE TABLE trolley_config_basket (
    trolley_config_id UUID REFERENCES trolley_config(trolley_config_id),
    basket_config_id UUID REFERENCES basket_config(basket_config_id),
    position_identifier VARCHAR(50) NOT NULL, /* e.g., "Slot 1", "Drawer A" */
    PRIMARY KEY (trolley_config_id, basket_config_id, position_identifier)
);

CREATE TABLE flight_route_trolley (
    flight_route_id UUID REFERENCES flight_route(flight_route_id),
    trolley_config_id UUID REFERENCES trolley_config(trolley_config_id),
    quantity_per_flight INT NOT NULL CHECK (quantity_per_flight > 0),
    PRIMARY KEY (flight_route_id, trolley_config_id)
);

/* Add some test "template" data */

/* Insert base products */
INSERT INTO product (product_id, name, barcode) VALUES
('a1a1a1a1-1111-1111-1111-000000000001', 'Coca-Cola Can', 'DUMMY_COKE_123'),
('a1a1a1a1-1111-1111-1111-000000000002', 'Cookie Pack', 'DUMMY_COOKIE_456'),
('a1a1a1a1-1111-1111-1111-000000000003', 'Water Bottle', 'DUMMY_WATER_789');

INSERT INTO basket_config (basket_config_id, name) VALUES
('b1b1b1b1-2222-2222-2222-000000000001', 'Standard Soft Drink Basket'),
('b1b1b1b1-2222-2222-2222-000000000002', 'Snack Basket');

INSERT INTO trolley_config (trolley_config_id, name) VALUES
('c1c1c1c1-3333-3333-3333-000000000001', 'Economy Snack/Drink Trolley (Half-Size)');

/* Insert a physical trolley and link it to a config */
INSERT INTO trolley (trolley_qr_id, trolley_config_id) VALUES
('GATE-TROLLEY-001', 'c1c1c1c1-3333-3333-3333-000000000001'),
('GATE-TROLLEY-002', 'c1c1c1c1-3333-3333-3333-000000000001');

INSERT INTO flight_route (flight_route_id, route_number, origin, destination) VALUES
('d1d1d1d1-4444-4444-4444-000000000001', 'AA123', 'DFW', 'LHR');

/* Link basket configs to products */
INSERT INTO basket_config_product (basket_config_id, product_id, expected_quantity) VALUES
('b1b1b1b1-2222-2222-2222-000000000001', 'a1a1a1a1-1111-1111-1111-000000000001', 40), /* 40 Cokes */
('b1b1b1b1-2222-2222-2222-000000000001', 'a1a1a1a1-1111-1111-1111-000000000003', 30), /* 30 Waters */
('b1b1b1b1-2222-2222-2222-000000000002', 'a1a1a1a1-1111-1111-1111-000000000002', 50); /* 50 Cookies */

/* Link trolley configs to basket configs */
INSERT INTO trolley_config_basket (trolley_config_id, basket_config_id, position_identifier) VALUES
('c1c1c1c1-3333-3333-3333-000000000001', 'b1b1b1b1-2222-2222-2222-000000000001', 'Slot-1A'), /* Drink basket in Slot 1A */
('c1c1c1c1-3333-3333-3333-000000000001', 'b1b1b1b1-2222-2222-2222-000000000002', 'Slot-1B'); /* Snack basket in Slot 1B */

/* Link flight routes to trolley configs */
INSERT INTO flight_route_trolley (flight_route_id, trolley_config_id, quantity_per_flight) VALUES
('d1d1d1d1-4444-4444-4444-000000000001', 'c1c1c1c1-3333-3333-3333-000000000001', 4); /* 4 of these trolleys on flight AA123 */