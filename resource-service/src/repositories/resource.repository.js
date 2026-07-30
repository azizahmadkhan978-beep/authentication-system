const { pool } = require("../config/database");

async function createResource({ title, description, createdBy }) {
  const result = await pool.query(
    `
    INSERT INTO resources (
      title,
      description,
      created_by
    )
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [title, description, createdBy]
  );

  return result.rows[0];
}

async function getResources() {
  const result = await pool.query(
    `
    SELECT *
    FROM resources
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

async function updateResource(id, { title, description }) {
  const result = await pool.query(
    `
    UPDATE resources
    SET
      title = $1,
      description = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [title, description, id]
  );

  return result.rows[0] || null;
}

async function deleteResource(id) {
  const result = await pool.query(
    `
    DELETE FROM resources
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return result.rows[0] || null;
}

module.exports = {
  createResource,
  getResources,
  updateResource,
  deleteResource,
};