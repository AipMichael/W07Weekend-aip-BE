require("dotenv").config();
const chalk = require("chalk");
const initializeDB = require("./database");
const { initializeServer } = require("./server");

const port = process.env.PORT ?? process.env.SERVER_PORT ?? 5050;

(async () => {
  try {
    await initializeDB(process.env.MONGO_DB_STRING);
    await initializeServer(port);
  } catch (error) {
    process.exit(1);
  }
})();
