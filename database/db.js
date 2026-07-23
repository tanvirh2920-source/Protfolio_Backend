const { Pool, Client } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DB_NAME || "portfolio";
const DB_HOST = (process.env.DB_HOST || "").toLowerCase();
const isLocalPostgres =
  !DATABASE_URL && ["localhost", "127.0.0.1", "::1"].includes(DB_HOST);

if (!DATABASE_URL && !/^[a-zA-Z0-9_]+$/.test(DB_NAME)) {
  throw new Error(
    `Invalid DB_NAME: "${DB_NAME}". Only alphanumeric characters and underscores are allowed.`,
  );
}

/**
 * Ensure database exists for local PostgreSQL instances.
 * Skipped for cloud-hosted databases like Neon/Supabase.
 */
async function ensureDatabase() {
  if (DATABASE_URL || !isLocalPostgres) return;

  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: "postgres",
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    ssl: false,
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME],
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Database "${DB_NAME}" created.`);
    }
  } catch (err) {
    console.error("Could not ensure database exists:", err.message);
    throw err;
  } finally {
    await client.end();
  }
}

// Build pool configuration
const poolConfig = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: DB_NAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT) || 5432,
      ssl: isLocalPostgres ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle DB client:", err.message);
});

module.exports = { pool, ensureDatabase };
