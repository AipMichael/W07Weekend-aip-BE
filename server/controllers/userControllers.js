const express = require("express");
require("dotenv").config();
const debug = require("debug")("user:controller");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");

const router = express.Router();

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    debug(chalk.redBright("Pssst! Wrong credentials."));
    const error = new Error("Pssst! Wrong credentials.");
    error.code = 401;
    next(error);
  } else {
    const rightPassword = await bcrypt.compare(password, user.password);
    if (!rightPassword) {
      debug(chalk.redBright("Pssst! Mistaken credentials!"));
      const error = new Error("Pssst! Mistaken credentials!");
      error.code = 401;
      next(error);
    } else {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          admin: user.admin,
        },
        process.env.SECRET,
        {
          expiresIn: 72 * 60 * 60,
        }
      );
      res.json({ token });
    }
  }
};

const userSignUp = async (req, res, next) => {
  const newUser = req.body;
  const user = await User.findOne({ username: newUser.username });
  if (user) {
    debug(chalk.redBright("Sorry. This username already exists."));
    const error = new Error("Sorry. This username already exists.");
    error.code = 400;
    next(error);
  } else {
    newUser.enemies = [];
    newUser.friends = [];
    newUser.password = await bcrypt.hash(newUser.password, 10);
    User.create(newUser);
    res.json(newUser);
  }
};

router.get("/", async () => {
  User.create({
    name: "aip",
    username: "aip",
    enemies: [],
    friends: [],
    photo: "https://i.giphy.com/media/1SvnHJFEuEH7hp81tF/giphy.webp",
    bio: "haciendo la catalana (cosas)",
    password: await bcrypt.hash("aipAiram", 10),
  });
});

module.exports = { userLogin, userSignUp };
