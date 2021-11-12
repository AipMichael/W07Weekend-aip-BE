const { Joi } = require("express-validation");

const loginSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

module.exports = { loginSchema };
