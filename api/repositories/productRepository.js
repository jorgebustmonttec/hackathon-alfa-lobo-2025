const db = require('../db');

/**
 * Finds all products.
 * @returns {Promise<Array<object>>} A list of all products.
 */
async function findAll() {
  const { rows } = await db.query('SELECT * FROM product');
  return rows;
}

module.exports = {
  findAll,
};