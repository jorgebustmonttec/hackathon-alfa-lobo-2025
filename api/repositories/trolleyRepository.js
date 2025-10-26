const db = require('../db');

/**
 * Finds a trolley and its associated flight route information by its QR ID.
 * @param {string} qrId - The unique QR ID of the trolley.
 * @returns {Promise<object|null>} The trolley and flight data, or null if not found.
 */
async function findByQrIdWithFlight(qrId) {
  const query = `
    SELECT
        t.trolley_id,
        t.trolley_qr_id,
        fr.flight_route_id,
        fr.route_number,
        fr.origin,
        origin_airport.city_name as origin_city,
        fr.destination,
        dest_airport.city_name as destination_city,
        t.origin_trolley_config_id,
        t.destination_trolley_config_id
    FROM
        trolley t
    JOIN
        flight_route fr ON t.flight_route_id = fr.flight_route_id
    LEFT JOIN
        airport origin_airport ON fr.origin = origin_airport.airport_code
    LEFT JOIN
        airport dest_airport ON fr.destination = dest_airport.airport_code
    WHERE
        t.trolley_qr_id = $1;
  `;
  const { rows } = await db.query(query, [qrId]);
  return rows[0] || null;
}

/**
 * Finds all trolleys with their basic information.
 * @returns {Promise<Array<object>>} A list of all trolleys.
 */
async function findAll() {
  const query = `
    SELECT
        trolley_id,
        trolley_qr_id,
        flight_route_id
    FROM
        trolley
    ORDER BY
        trolley_qr_id;
  `;
  const { rows } = await db.query(query);
  return rows;
}

module.exports = {
  findByQrIdWithFlight,
  findAll,
};