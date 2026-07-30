const { pool } = require("../config/database");

function requirePermission(requiredPermission) {
  return async function permissionMiddleware(req, res, next) {
    try {
      const role = req.user?.role;

      if (!role) {
        return res.status(401).json({
          message: "Authenticated user information is missing",
        });
      }

      const result = await pool.query(
        `
        SELECT 1
        FROM roles
        JOIN role_permissions
          ON role_permissions.role_id = roles.id
        JOIN permissions
          ON permissions.id = role_permissions.permission_id
        WHERE roles.name = $1
          AND permissions.name = $2
        LIMIT 1
        `,
        [role, requiredPermission]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({
          message: `Missing required permission: ${requiredPermission}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  requirePermission,
};