const fs = require('fs');
const path = require('path');
const { pool, ensureDatabase } = require('../database/db');

/**
 * Initialize database tables and run necessary schema migrations.
 */
async function createTables() {
  await ensureDatabase();

  const schemaPath = path.join(__dirname, 'schema.sql');
  try {
    const sql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(sql);
    console.log('✅ Schema tables verified.');

    // Database column migrations
    const migrations = [
      "ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS stat_projects INTEGER DEFAULT 15",
      "ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS stat_technologies INTEGER DEFAULT 20",
      "ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS stat_repos INTEGER DEFAULT 30",
      "ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS stat_coffee INTEGER DEFAULT 999",
      "ALTER TABLE portfolio_settings ADD COLUMN IF NOT EXISTS about_text TEXT",
    ];

    for (const m of migrations) {
      try {
        await pool.query(m);
      } catch (_) {
        // column may already exist
      }
    }
    console.log('✅ Migrations checked.');
  } catch (err) {
    console.error('❌ Table creation failed:', err.message);
    throw err;
  }
}

module.exports = { createTables };
