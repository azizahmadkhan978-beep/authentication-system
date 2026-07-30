const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const resourceRoutes = require("./routes/resource.routes");

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
    service: "resource-service",
    status: "healthy",
  });
});

app.use(resourceRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;