import { ensureDatabase } from "../config/initDb.js";

ensureDatabase()
  .then(() => {
    console.log("Setup complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("\nDatabase setup failed.");
    console.error(err.message);
    console.error("\nMake sure MySQL is running, then copy backend/.env.example to backend/.env and retry.");
    process.exit(1);
  });
