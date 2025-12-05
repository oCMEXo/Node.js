
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');


const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'workspace_app'
});

async function applySchema() {
  const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
  const statements = schemaSql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length);

  const client = await pool.connect();
  try {
    for (const stmt of statements) {
      await client.query(stmt);
    }
    console.log('PostgreSQL schema ensured.');
  } catch (err) {
    console.error('Error applying schema:', err);
  } finally {
    client.release();
  }
}

applySchema().catch(err => {
  console.error('Error during schema initialization:', err);
});

module.exports = {
  pool
};
