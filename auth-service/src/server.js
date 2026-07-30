require("dotenv").config();

const app = require("./app");
const { testDatabaseConnection } = require("./config/database");

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    await testDatabaseConnection();

    app.listen(port, () => {
      console.log(`Auth Service running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start Auth Service:", error.message);
    process.exit(1);
  }
}

startServer();