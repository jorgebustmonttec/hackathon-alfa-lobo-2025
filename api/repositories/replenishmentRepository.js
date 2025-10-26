const db = require('../db');

/**
 * Creates a new replenishment log entry in a transaction.
 * @param {object} logData - The data for the log.
 * @param {string} logData.trolley_id - UUID of the trolley.
 * @param {string} logData.user_id - UUID of the user.
 * @param {string} logData.flight_route_id - UUID of the flight route.
 * @param {string} logData.location_code - The airport code where replenishment happens.
 * @param {string} logData.started_at - ISO 8601 timestamp from the client.
 * @param {Array<object>} logData.details - Array of log details.
 * @returns {Promise<object>} The created log summary.
 */
async function createLog(logData) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // 1. Insert the main log record
    const logInsertQuery = `
      INSERT INTO replenishment_log (trolley_id, user_id, flight_route_id, location_code, started_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING log_id;
    `;
    const { rows: logRows } = await client.query(logInsertQuery, [
      logData.trolley_id,
      logData.user_id,
      logData.flight_route_id,
      logData.location_code,
      logData.started_at, // Use client-provided start time
    ]);
    const { log_id } = logRows[0];

    // 2. Insert all the detail records
    for (const detail of logData.details) {
      const detailInsertQuery = `
        INSERT INTO replenishment_log_detail (log_id, product_id, position_identifier, expected_quantity, counted_quantity)
        VALUES ($1, $2, $3, $4, $5);
      `;
      await client.query(detailInsertQuery, [
        log_id,
        detail.product_id,
        detail.position_identifier,
        detail.expected_quantity,
        detail.counted_quantity,
      ]);
    }

    // 3. Update the completion time on the main log record
    const { rows: updatedLog } = await client.query(
      'UPDATE replenishment_log SET completed_at = NOW() WHERE log_id = $1 RETURNING completed_at, started_at;',
      [log_id]
    );
    const { completed_at, started_at } = updatedLog[0];

    await client.query('COMMIT');

    return {
      log_id,
      started_at,
      completed_at,
      details_count: logData.details.length,
      message: 'Log created successfully',
    };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e; // Re-throw the error to be caught by the route handler
  } finally {
    client.release();
  }
}

/**
 * Finds all replenishment logs.
 * @returns {Promise<Array<object>>} A list of all logs.
 */
async function findAllLogs() {
  const { rows } = await db.query(`
    SELECT l.log_id, u.username, t.trolley_qr_id, fr.route_number, l.location_code, l.started_at, l.completed_at
    FROM replenishment_log l
    JOIN app_user u ON l.user_id = u.user_id
    JOIN trolley t ON l.trolley_id = t.trolley_id
    JOIN flight_route fr ON l.flight_route_id = fr.flight_route_id
    ORDER BY l.started_at DESC;
  `);
  return rows;
}

/**
 * Finds all replenishment logs for a specific user.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<Array<object>>} A list of logs for the user.
 */
async function findLogsByUserId(userId) {
  const { rows } = await db.query(`
    SELECT l.log_id, u.username, t.trolley_qr_id, fr.route_number, l.location_code, l.started_at, l.completed_at
    FROM replenishment_log l
    JOIN app_user u ON l.user_id = u.user_id
    JOIN trolley t ON l.trolley_id = t.trolley_id
    JOIN flight_route fr ON l.flight_route_id = fr.flight_route_id
    WHERE l.user_id = $1
    ORDER BY l.started_at DESC;
  `, [userId]);
  return rows;
}

module.exports = {
  createLog,
  findAllLogs,
  findLogsByUserId,
};