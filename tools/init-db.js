
// Simple script to ensure PostgreSQL schema is applied.
// Uses the same db.js as the app.
const { pool } = require('../db');

(async () => {
  try {
    // db.js already applies schema on import, so we just connect once.
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Database is reachable and schema should be applied.');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing DB:', err);
    process.exit(1);
  }
})();
