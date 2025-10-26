const db = require('../db');

/**
 * Finds a user by their ID.
 * @param {string} userId - The UUID of the user.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
async function findById(userId) {
  const { rows } = await db.query(
    'SELECT user_id, username FROM app_user WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
}

/**
 * Finds a user by their username.
 * @param {string} username - The username of the user.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
async function findByUsername(username) {
  const { rows } = await db.query(
    'SELECT user_id, username FROM app_user WHERE username = $1',
    [username]
  );
  return rows[0] || null;
}

/**
 * Finds all users.
 * @returns {Promise<Array<object>>} A list of all users.
 */
async function findAll() {
  const { rows } = await db.query('SELECT user_id, username, created_at FROM app_user ORDER BY username');
  return rows;
}

module.exports = {
  findById,
  findByUsername,
  findAll,
};