const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Authorization header is required",
    });
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Authorization header must use Bearer token format",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: process.env.JWT_ISSUER || "auth-service",
      audience: process.env.JWT_AUDIENCE || "resource-service",
    });

    req.user = {
      id: decoded.sub,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Access token has expired",
      });
    }

    return res.status(401).json({
      message: "Invalid access token",
    });
  }
}

module.exports = {
  authenticateToken,
};