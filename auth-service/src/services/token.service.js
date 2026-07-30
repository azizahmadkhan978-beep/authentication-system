const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      issuer: process.env.JWT_ISSUER || "auth-service",
      audience: process.env.JWT_AUDIENCE || "resource-service",
    }
  );
}

module.exports = {
  generateAccessToken,
};