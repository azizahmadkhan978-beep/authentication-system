const { pool } = require("../config/database");

async function findUserByEmail(email) {
  const result = await pool.query(
    `
    SELECT
      users.id,
      users.name,
      users.email,
      users.password_hash,
      users.role_id,
      roles.name AS role
    FROM users
    JOIN roles ON roles.id = users.role_id
    WHERE users.email = $1
    `,
    [email.toLowerCase()]
  );

  return result.rows[0] || null;
}

async function findRoleByName(roleName) {
  const result = await pool.query(
    `
    SELECT id, name
    FROM roles
    WHERE name = $1
    `,
    [roleName]
  );

  return result.rows[0] || null;
}

async function createUser({ name, email, passwordHash, roleId }) {
  const result = await pool.query(
    `
    INSERT INTO users (
      name,
      email,
      password_hash,
      role_id
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      id,
      name,
      email,
      role_id,
      created_at
    `,
    [name, email.toLowerCase(), passwordHash, roleId]
  );

  return result.rows[0];
}

module.exports = {
  findUserByEmail,
  findRoleByName,
  createUser,
};