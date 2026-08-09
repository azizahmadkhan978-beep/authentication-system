require("dotenv").config();

const app = require("./app");
const { testDatabaseConnection } = require("./config/database");

const port = process.env.PORT || 3001;
const host = "0.0.0.0";

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(port,host, () => {
      console.log(`Auth Service running on http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Failed to start Auth Service:", error.message);
    process.exit(1);
  }
}

startServer();