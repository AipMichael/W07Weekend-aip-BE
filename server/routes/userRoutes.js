const express = require("express");

const { validate } = require("express-validation");
const bcrypt = require("bcrypt");
const { userLogin } = require("../controllers/userControllers");
const { loginSchema } = require("../schemas/userSchema");
const User = require("../../database/models/user");

const router = express.Router();

router.post("/login", validate(loginSchema), userLogin);

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

module.exports = router;
