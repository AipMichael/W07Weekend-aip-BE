const { Joi } = require("express-validation");

const loginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const signUpSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    image: Joi.string(),
    bio: Joi.string(),
  }),
};

module.exports = { loginSchema, signUpSchema };
