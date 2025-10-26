const db = require('../db');

async function findAll() {
  const { rows } = await db.query('SELECT * FROM product;');
  return rows;
}

module.exports = {
  findAll,
};