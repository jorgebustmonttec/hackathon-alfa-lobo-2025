/* V4: Add airport lookup table and more flight routes */

/* 1. Create the Airport Lookup Table */
CREATE TABLE airport (
    airport_code VARCHAR(10) PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    airport_name VARCHAR(255) NOT NULL
);

/* 2. Populate the Airport Lookup Table */
-- Includes existing airports from V2/V3 and adds ~20 more major hubs.
INSERT INTO airport (airport_code, city_name, airport_name) VALUES
('DFW', 'Dallas-Fort Worth', 'Dallas/Fort Worth International Airport'),
('LHR', 'London', 'Heathrow Airport'),
('JFK', 'New York', 'John F. Kennedy International Airport'),
('LAX', 'Los Angeles', 'Los Angeles International Airport'),
('CDG', 'Paris', 'Charles de Gaulle Airport'),
('AMS', 'Amsterdam', 'Amsterdam Airport Schiphol'),
('FRA', 'Frankfurt', 'Frankfurt Airport'),
('DXB', 'Dubai', 'Dubai International Airport'),
('HND', 'Tokyo', 'Haneda Airport'),
('ICN', 'Seoul', 'Incheon International Airport'),
('SIN', 'Singapore', 'Singapore Changi Airport'),
('HKG', 'Hong Kong', 'Hong Kong International Airport'),
('PEK', 'Beijing', 'Beijing Capital International Airport'),
('ORD', 'Chicago', 'O''Hare International Airport'),
('ATL', 'Atlanta', 'Hartsfield-Jackson Atlanta International Airport'),
('MIA', 'Miami', 'Miami International Airport'),
('SYD', 'Sydney', 'Sydney Kingsford Smith Airport'),
('YYZ', 'Toronto', 'Toronto Pearson International Airport'),
('MEX', 'Mexico City', 'Mexico City International Airport'),
('GRU', 'São Paulo', 'São Paulo/Guarulhos International Airport'),
('BCN', 'Barcelona', 'Barcelona–El Prat Airport'),
('MUC', 'Munich', 'Munich Airport'),
('ZRH', 'Zurich', 'Zurich Airport');


/* 3. Add More Sample Flight Routes */
INSERT INTO flight_route (route_number, origin, destination) VALUES
('UA456', 'JFK', 'LAX'),
('DL789', 'ATL', 'CDG'),
('AF011', 'CDG', 'JFK'),
('LH990', 'FRA', 'SIN'),
('EK202', 'DXB', 'MIA');