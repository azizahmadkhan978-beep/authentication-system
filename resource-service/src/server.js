require("dotenv").config();

const app = require("./app");
const { testDatabaseConnection } = require("./config/database");

const port = Number(process.env.PORT) || 3002;

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(port, () => {
      console.log(`Resource Service running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start Resource Service:", error);
    process.exit(1);
  }
}

startServer();