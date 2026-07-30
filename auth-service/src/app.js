const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");

const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({
    service: "auth-service",
    status: "healthy",
  });
});

app.use(authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;