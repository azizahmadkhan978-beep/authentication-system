require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("../src/config/database");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    name: "Editor User",
    email: "editor@example.com",
    password: "Editor123!",
    role: "editor",
  },
  {
    name: "Viewer User",
    email: "viewer@example.com",
    password: "Viewer123!",
    role: "viewer",
  },
];

async function seedUsers() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const user of users) {
      const roleResult = await client.query(
        "SELECT id FROM roles WHERE name = $1",
        [user.role]
      );

      if (roleResult.rowCount === 0) {
        throw new Error(`Role not found: ${user.role}`);
      }

      const roleId = roleResult.rows[0].id;
      const passwordHash = await bcrypt.hash(user.password, 12);

      await client.query(
        `
        INSERT INTO users (
          name,
          email,
          password_hash,
          role_id
        )
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email)
        DO UPDATE SET
          name = EXCLUDED.name,
          password_hash = EXCLUDED.password_hash,
          role_id = EXCLUDED.role_id,
          updated_at = CURRENT_TIMESTAMP
        `,
        [
          user.name,
          user.email.toLowerCase(),
          passwordHash,
          roleId,
        ]
      );

      console.log(`Seeded ${user.role}: ${user.email}`);
    }

    await client.query("COMMIT");
    console.log("User seeding completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to seed users:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();