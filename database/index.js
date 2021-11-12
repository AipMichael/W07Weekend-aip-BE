const debug = require("debug")("series:database");
const chalk = require("chalk");
const mongoose = require("mongoose");

const initializeDB = (connectionString) => 
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {

        delete ret._id;

        delete ret.__v;
      },
    });

    mongoose.connect(connectionString, (error) => {
      if (error) {
        debug(chalk.green("Could not connect to database"));
        reject(error);
      }
      debug(chalk.green("Connection to database successful"));
      resolve();
    });

    mongoose.connection.on("close", () => {
      debug(chalk.green("Connection to database is closed."));
    });
  });
};
