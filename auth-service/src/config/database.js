const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL error:", error);
});

async function testDatabaseConnection() {
  const client = await pool.connect();

  try {
    await client.query("SELECT 1");
    console.log("Auth Service connected to PostgreSQL");
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  testDatabaseConnection,
};