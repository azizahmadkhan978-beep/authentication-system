function notFoundHandler(req, res) {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, req, res, next) {
  console.error("Unhandled error:", error);

  if (error.code === "23505") {
    return res.status(409).json({
      message: "A record with the same unique value already exists",
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};