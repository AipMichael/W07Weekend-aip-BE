const express = require("express");
const chalk = require("chalk");
const morgan = require("morgan");
const debug = require("debug")("series:server");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");

const router = express.Router();

const { notFoundErrorHandler, errorHandler } = require("./middlewares/error");

const app = express();
app.use(cors());

const initializeServer = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.green(`connecting to ${port}`));
      resolve(server);
    });

    server.on("error", (error) => {
      debug(chalk.red("Error to initialize Server"));
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`Port ${port} is already in use.`));
      }

      debug(chalk.red(error.code));
      /*       reject(); */
    });

    server.on("close", () => {
      debug(chalk.blue("See you soon"));
    });
  });

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", userRoutes);

app.use(notFoundErrorHandler);
app.use(errorHandler);

module.exports = { initializeServer, app };
