/* V7: Update position identifiers to a simpler format (A1, B1, etc.) */

-- This script updates all existing position identifiers to the new format.
-- It assumes a max of 4 rows of baskets per trolley config.

UPDATE trolley_config_basket SET position_identifier = 'A1' WHERE position_identifier = 'Slot-1A';
UPDATE trolley_config_basket SET position_identifier = 'B1' WHERE position_identifier = 'Slot-1B';
UPDATE trolley_config_basket SET position_identifier = 'A2' WHERE position_identifier = 'Slot-2A';
UPDATE trolley_config_basket SET position_identifier = 'B2' WHERE position_identifier = 'Slot-2B';
UPDATE trolley_config_basket SET position_identifier = 'A3' WHERE position_identifier = 'Slot-3A';
UPDATE trolley_config_basket SET position_identifier = 'B3' WHERE position_identifier = 'Slot-3B';
UPDATE trolley_config_basket SET position_identifier = 'A4' WHERE position_identifier = 'Slot-4A';
UPDATE trolley_config_basket SET position_identifier = 'B4' WHERE position_identifier = 'Slot-4B';