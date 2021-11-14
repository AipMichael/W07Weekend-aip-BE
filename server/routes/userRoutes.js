const express = require("express");
const { validate } = require("express-validation");
const auth = require("../middlewares/auth");

const {
  userLogin,
  userSignUp,
  getUsers,
} = require("../controllers/userControllers");
const { loginSchema, signUpSchema } = require("../schemas/userSchema");

const router = express.Router();

router.post("/login", validate(loginSchema), userLogin);
router.post("/register", validate(signUpSchema), userSignUp);
router.get("/", auth, getUsers);

module.exports = router;
