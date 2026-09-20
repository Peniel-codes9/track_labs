const Joi = require("joi");

// role is never accepted here on purpose — see auth.controller.js register().
const registerSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const changeRoleSchema = Joi.object({
  role: Joi.string().valid("member", "librarian").required(),
});

module.exports = { registerSchema, loginSchema, changeRoleSchema };
