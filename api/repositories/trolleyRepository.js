const db = require('../db');

async function findAll() {
  const { rows } = await db.query('SELECT * FROM trolley;');
  return rows;
}

async function findByQrId(qrId) {
  const { rows } = await db.query(
    `
      SELECT
        t.trolley_id,
        t.trolley_qr_id,
        t.flight_route_id,
        t.origin_trolley_config_id,
        t.destination_trolley_config_id,
        fr.route_number,
        fr.origin,
        fr.destination
      FROM
        trolley t
      JOIN
        flight_route fr ON t.flight_route_id = fr.flight_route_id
      WHERE
        t.trolley_qr_id = $1;
    `,
    [qrId]
  );
  return rows[0] || null;
}

module.exports = {
  findAll,
  findByQrId,
};