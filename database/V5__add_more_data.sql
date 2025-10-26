/* V5: Add a large amount of realistic data for products, trolleys, and configs */

/* 1. Clean up existing product data to be more realistic */
UPDATE product SET name = 'Coca-Cola (330ml can)', barcode = '5000112548103' WHERE name = 'Coca-Cola Can';
UPDATE product SET name = 'Walkers Shortbread (2-pack)', barcode = '039047001017' WHERE name = 'Cookie Pack';
UPDATE product SET name = 'Evian Water (500ml)', barcode = '3068320114328' WHERE name = 'Water Bottle';


/* 2. Add a large variety of new products */
INSERT INTO product (product_id, name, barcode) VALUES
-- Soft Drinks
('a1a1a1a1-1111-1111-1111-000000000004', 'Diet Coke (330ml can)', '5000112548165'),
('a1a1a1a1-1111-1111-1111-000000000005', 'Sprite (330ml can)', '5000112624456'),
('a1a1a1a1-1111-1111-1111-000000000006', 'Tropicana Orange Juice (200ml)', '5010102120304'),
('a1a1a1a1-1111-1111-1111-000000000007', 'Big Tom Tomato Juice (150ml)', '5014272000019'),
('a1a1a1a1-1111-1111-1111-000000000008', 'Schweppes Tonic Water (150ml)', '5449000008013'),
('a1a1a1a1-1111-1111-1111-000000000009', 'San Pellegrino Sparkling Water (250ml)', '8002270001303'),
-- Alcohol
('a1a1a1a1-1111-1111-1111-000000000010', 'Heineken Beer (330ml can)', '8712000023312'),
('a1a1a1a1-1111-1111-1111-000000000011', 'Gallo Red Wine (187ml bottle)', '0085000013207'),
('a1a1a1a1-1111-1111-1111-000000000012', 'Gallo White Wine (187ml bottle)', '0085000013221'),
('a1a1a1a1-1111-1111-1111-000000000013', 'Gordons Gin (50ml miniature)', '5000281003105'),
('a1a1a1a1-1111-1111-1111-000000000014', 'Smirnoff Vodka (50ml miniature)', '5000281001200'),
('a1a1a1a1-1111-1111-1111-000000000015', 'Johnnie Walker Black Label (50ml miniature)', '5000267013602'),
-- Snacks
('a1a1a1a1-1111-1111-1111-000000000016', 'Pringles Original (40g)', '5053990101532'),
('a1a1a1a1-1111-1111-1111-000000000017', 'KitKat (4-finger)', '7613036833389'),
('a1a1a1a1-1111-1111-1111-000000000018', 'Snickers Bar', '5000159461122'),
('a1a1a1a1-1111-1111-1111-000000000019', 'Penn State Pretzels (30g)', '5000335490103'),
('a1a1a1a1-1111-1111-1111-000000000020', 'Haribo Goldbears (100g)', '4001686301225'),
-- Food
('a1a1a1a1-1111-1111-1111-000000000021', 'Butter Croissant', 'FOOD_CROISSANT_01'),
('a1a1a1a1-1111-1111-1111-000000000022', 'Blueberry Muffin', 'FOOD_MUFFIN_01'),
('a1a1a1a1-1111-1111-1111-000000000023', 'Ham and Cheese Sandwich', 'FOOD_SANDWICH_01'),
('a1a1a1a1-1111-1111-1111-000000000024', 'Instant Noodle Pot', 'FOOD_NOODLE_01'),
-- Misc / Amenities
('a1a1a1a1-1111-1111-1111-000000000025', 'Paper Napkins (pack)', 'MISC_NAPKIN_01'),
('a1a1a1a1-1111-1111-1111-000000000026', 'Plastic Cups (sleeve)', 'MISC_CUPS_01'),
('a1a1a1a1-1111-1111-1111-000000000027', 'Stirrers (pack)', 'MISC_STIRRER_01'),
('a1a1a1a1-1111-1111-1111-000000000028', 'Sugar Packets (box)', 'MISC_SUGAR_01'),
('a1a1a1a1-1111-1111-1111-000000000029', 'Coffee Creamer (box)', 'MISC_CREAMER_01'),
('a1a1a1a1-1111-1111-1111-000000000030', 'Wet Wipes (pack)', 'MISC_WETWIPE_01');


/* 3. Create new basket and trolley configurations */
INSERT INTO basket_config (basket_config_id, name) VALUES
('b1b1b1b1-2222-2222-2222-000000000003', 'Liquor Minis Basket'),
('b1b1b1b1-2222-2222-2222-000000000004', 'Wine & Beer Basket'),
('b1b1b1b1-2222-2222-2222-000000000005', 'Juice & Water Basket'),
('b1b1b1b1-2222-2222-2222-000000000006', 'Sweet & Salty Snacks Basket'),
('b1b1b1b1-2222-2222-2222-000000000007', 'Amenity Basket');

INSERT INTO trolley_config (trolley_config_id, name) VALUES
('c1c1c1c1-3333-3333-3333-000000000003', 'Full-Size Bar Service Trolley'),
('c1c1c1c1-3333-3333-3333-000000000004', 'Half-Size Snack Service Trolley');


/* 4. Link products to the new basket configurations */
INSERT INTO basket_config_product (basket_config_id, product_id, expected_quantity) VALUES
-- Liquor Minis Basket
('b1b1b1b1-2222-2222-2222-000000000003', 'a1a1a1a1-1111-1111-1111-000000000013', 12), -- Gin
('b1b1b1b1-2222-2222-2222-000000000003', 'a1a1a1a1-1111-1111-1111-000000000014', 12), -- Vodka
('b1b1b1b1-2222-2222-2222-000000000003', 'a1a1a1a1-1111-1111-1111-000000000015', 12), -- Whiskey
-- Wine & Beer Basket
('b1b1b1b1-2222-2222-2222-000000000004', 'a1a1a1a1-1111-1111-1111-000000000010', 24), -- Heineken
('b1b1b1b1-2222-2222-2222-000000000004', 'a1a1a1a1-1111-1111-1111-000000000011', 10), -- Red Wine
('b1b1b1b1-2222-2222-2222-000000000004', 'a1a1a1a1-1111-1111-1111-000000000012', 10), -- White Wine
-- Juice & Water Basket
('b1b1b1b1-2222-2222-2222-000000000005', 'a1a1a1a1-1111-1111-1111-000000000003', 20), -- Evian
('b1b1b1b1-2222-2222-2222-000000000005', 'a1a1a1a1-1111-1111-1111-000000000006', 15), -- Orange Juice
('b1b1b1b1-2222-2222-2222-000000000005', 'a1a1a1a1-1111-1111-1111-000000000007', 10), -- Tomato Juice
('b1b1b1b1-2222-2222-2222-000000000005', 'a1a1a1a1-1111-1111-1111-000000000009', 15), -- Sparkling Water
-- Sweet & Salty Snacks Basket
('b1b1b1b1-2222-2222-2222-000000000006', 'a1a1a1a1-1111-1111-1111-000000000016', 20), -- Pringles
('b1b1b1b1-2222-2222-2222-000000000006', 'a1a1a1a1-1111-1111-1111-000000000017', 15), -- KitKat
('b1b1b1b1-2222-2222-2222-000000000006', 'a1a1a1a1-1111-1111-1111-000000000018', 15), -- Snickers
('b1b1b1b1-2222-2222-2222-000000000006', 'a1a1a1a1-1111-1111-1111-000000000019', 20), -- Pretzels
-- Amenity Basket
('b1b1b1b1-2222-2222-2222-000000000007', 'a1a1a1a1-1111-1111-1111-000000000025', 1), -- Napkins
('b1b1b1b1-2222-2222-2222-000000000007', 'a1a1a1a1-1111-1111-1111-000000000026', 1), -- Cups
('b1b1b1b1-2222-2222-2222-000000000007', 'a1a1a1a1-1111-1111-1111-000000000027', 1); -- Stirrers


/* 5. Link basket configurations to the new trolley configurations */
INSERT INTO trolley_config_basket (trolley_config_id, basket_config_id, position_identifier) VALUES
-- Full-Size Bar Service Trolley (8 baskets)
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000001', 'Slot-1A'), -- Soft Drink
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000001', 'Slot-1B'), -- Soft Drink
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000004', 'Slot-2A'), -- Wine & Beer
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000003', 'Slot-2B'), -- Liquor
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000005', 'Slot-3A'), -- Juice & Water
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000006', 'Slot-3B'), -- Snacks
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000006', 'Slot-4A'), -- Snacks
('c1c1c1c1-3333-3333-3333-000000000003', 'b1b1b1b1-2222-2222-2222-000000000007', 'Slot-4B'), -- Amenities
-- Half-Size Snack Service Trolley (4 baskets)
('c1c1c1c1-3333-3333-3333-000000000004', 'b1b1b1b1-2222-2222-2222-000000000001', 'Slot-1A'), -- Soft Drink
('c1c1c1c1-3333-3333-3333-000000000004', 'b1b1b1b1-2222-2222-2222-000000000005', 'Slot-1B'), -- Juice & Water
('c1c1c1c1-3333-3333-3333-000000000004', 'b1b1b1b1-2222-2222-2222-000000000002', 'Slot-2A'), -- Original Snack Basket
('c1c1c1c1-3333-3333-3333-000000000004', 'b1b1b1b1-2222-2222-2222-000000000006', 'Slot-2B'); -- New Snack Basket


/* 6. Add new trolleys for each flight route */
-- Flight AA123 (DFW <-> LHR)
INSERT INTO trolley (trolley_qr_id, flight_route_id, origin_trolley_config_id, destination_trolley_config_id) VALUES
('GATE-TROLLEY-003', 'd1d1d1d1-4444-4444-4444-000000000001', 'c1c1c1c1-3333-3333-3333-000000000003', 'c1c1c1c1-3333-3333-3333-000000000001'),
('GATE-TROLLEY-004', 'd1d1d1d1-4444-4444-4444-000000000001', 'c1c1c1c1-3333-3333-3333-000000000004', 'c1c1c1c1-3333-3333-3333-000000000004');
-- Flight UA456 (JFK <-> LAX)
INSERT INTO trolley (trolley_qr_id, flight_route_id, origin_trolley_config_id, destination_trolley_config_id) VALUES
('GATE-TROLLEY-005', (SELECT flight_route_id FROM flight_route WHERE route_number = 'UA456'), 'c1c1c1c1-3333-3333-3333-000000000001', 'c1c1c1c1-3333-3333-3333-000000000001'),
('GATE-TROLLEY-006', (SELECT flight_route_id FROM flight_route WHERE route_number = 'UA456'), 'c1c1c1c1-3333-3333-3333-000000000004', 'c1c1c1c1-3333-3333-3333-000000000004');
-- Flight DL789 (ATL <-> CDG)
INSERT INTO trolley (trolley_qr_id, flight_route_id, origin_trolley_config_id, destination_trolley_config_id) VALUES
('GATE-TROLLEY-007', (SELECT flight_route_id FROM flight_route WHERE route_number = 'DL789'), 'c1c1c1c1-3333-3333-3333-000000000003', 'c1c1c1c1-3333-3333-3333-000000000003'),
('GATE-TROLLEY-008', (SELECT flight_route_id FROM flight_route WHERE route_number = 'DL789'), 'c1c1c1c1-3333-3333-3333-000000000001', 'c1c1c1c1-3333-3333-3333-000000000002');
-- Flight AF011 (CDG <-> JFK)
INSERT INTO trolley (trolley_qr_id, flight_route_id, origin_trolley_config_id, destination_trolley_config_id) VALUES
('GATE-TROLLEY-009', (SELECT flight_route_id FROM flight_route WHERE route_number = 'AF011'), 'c1c1c1c1-3333-3333-3333-000000000003', 'c1c1c1c1-3333-3333-3333-000000000003'),
('GATE-TROLLEY-010', (SELECT flight_route_id FROM flight_route WHERE route_number = 'AF011'), 'c1c1c1c1-3333-3333-3333-000000000004', 'c1c1c1c1-3333-3333-3333-000000000004');
-- Flight LH990 (FRA <-> SIN)
INSERT INTO trolley (trolley_qr_id, flight_route_id, origin_trolley_config_id, destination_trolley_config_id) VALUES
('GATE-TROLLEY-011', (SELECT flight_route_id FROM flight_route WHERE route_number = 'LH990'), 'c1c1c1c1-3333-3333-3333-000000000003', 'c1c1c1c1-3333-3333-3333-000000000003'),
('GATE-TROLLEY-012', (SELECT flight_route_id FROM flight_route WHERE route_number = 'LH990'), 'c1c1c1c1-3333-3333-3333-000000000003', 'c1c1c1c1-3333-3333-3333-000000000003');
-- Flight EK202 (DXB <-> MIA)
INSERT INTO trolley (trolley_qr_id, flight_route_id, origin_trolley_config_id, destination_trolley_config_id) VALUES
('GATE-TROLLEY-013', (SELECT flight_route_id FROM flight_route WHERE route_number = 'EK202'), 'c1c1c1c1-3333-3333-3333-000000000001', 'c1c1c1c1-3333-3333-3333-000000000002'),
('GATE-TROLLEY-014', (SELECT flight_route_id FROM flight_route WHERE route_number = 'EK202'), 'c1c1c1c1-3333-3333-3333-000000000004', 'c1c1c1c1-3333-3333-3333-000000000004');