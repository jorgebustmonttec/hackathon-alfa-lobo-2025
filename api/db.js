const { Pool } = require('pg');

// The pool will use the environment variables PGHOST, PGUSER, PGDATABASE, PGPASSWORD, and PGPORT
// which are automatically passed to the container by Docker Compose from your .env file.
const pool = new Pool();

module.exports = {
  query: (text, params) => pool.query(text, params),
};