const { Joi } = require("express-validation");

const loginSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    image: Joi.string().required(),
    bio: Joi.string().required(),
  }),
};

module.exports = { loginSchema };
