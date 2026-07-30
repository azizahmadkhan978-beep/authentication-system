function notFoundHandler(req, res) {
  return res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, req, res, next) {
  console.error("Unhandled Resource Service error:", error);

  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};