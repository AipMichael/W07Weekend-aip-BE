require("dotenv").config();
const initializeDB = require("./database");
const { initializeServer } = require("./server");

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5050;

(async () => {
  try {
    await initializeDB(process.env.MONGO_DB_STRING);
    initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
