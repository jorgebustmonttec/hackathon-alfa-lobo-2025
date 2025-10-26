const db = require('../db');

async function findAll() {
  const { rows } = await db.query('SELECT * FROM basket_config;');
  return rows;
}

module.exports = {
  findAll,
};