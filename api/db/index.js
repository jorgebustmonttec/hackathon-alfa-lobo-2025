const { Pool } = require('pg');

// When the API runs in a Docker container, it must connect to the 'database'
// service name, not 'localhost'.
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: 'database',
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};