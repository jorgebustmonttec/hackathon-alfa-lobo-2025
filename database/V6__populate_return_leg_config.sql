/* V6: Populate the previously empty "Return Leg" trolley configuration */

-- The trolley_config with ID '...0002' was created in V2 but never had any baskets assigned.
-- This migration assigns it a simple configuration with two snack baskets.

INSERT INTO trolley_config_basket (trolley_config_id, basket_config_id, position_identifier) VALUES
-- Trolley Config ID for "Economy Snack/Drink Trolley (Return Leg)"
('c1c1c1c1-3333-3333-3333-000000000002', 'b1b1b1b1-2222-2222-2222-000000000002', 'Slot-1A'), -- Snack Basket
('c1c1c1c1-3333-3333-3333-000000000002', 'b1b1b1b1-2222-2222-2222-000000000006', 'Slot-1B'); -- Sweet & Salty Snacks Basket