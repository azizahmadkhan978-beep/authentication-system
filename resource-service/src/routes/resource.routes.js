const express = require("express");

const {
  authenticateToken,
} = require("../middleware/authenticate.middleware");

const {
  requirePermission,
} = require("../middleware/authorize.middleware");

const {
  create,
  getAll,
  update,
  remove,
} = require("../controllers/resource.controller");

const router = express.Router();

router.post(
  "/resource",
  authenticateToken,
  requirePermission("create"),
  create
);

router.get(
  "/resource",
  authenticateToken,
  requirePermission("read"),
  getAll
);

router.put(
  "/resource/:id",
  authenticateToken,
  requirePermission("update"),
  update
);

router.delete(
  "/resource/:id",
  authenticateToken,
  requirePermission("delete"),
  remove
);

module.exports = router;