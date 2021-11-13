const express = require("express");

const { validate } = require("express-validation");
/* const bcrypt = require("bcrypt"); */
const { userLogin, userSignUp } = require("../controllers/userControllers");
const { loginSchema, signUpSchema } = require("../schemas/userSchema");
/* const User = require("../../database/models/user"); */

const router = express.Router();

router.post("/login", validate(loginSchema), userLogin);
router.post("/register", validate(signUpSchema), userSignUp);

module.exports = router;
