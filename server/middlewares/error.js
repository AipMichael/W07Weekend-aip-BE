const debug = require("debug")("users:errors");
const chalk = require("chalk");
const { ValidationError } = require("express-validation");

const notFoundErrorHandler = (req, res) => {
  res.status(404).json({ error: "Sorry, dead end." });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  debug(chalk.red("An error has occurred: ", error.message));
  if (error instanceof ValidationError) {
    error.code = 401;
    error.message = "Oh no! You've made a mistake!";
  }
  const message = error.code ? error.message : "BOOM! All broken :(";
  res.status(error.code || 500).json({ error: message });
};

module.exports = { notFoundErrorHandler, errorHandler };
