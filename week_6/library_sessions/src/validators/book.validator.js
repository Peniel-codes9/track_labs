const Joi = require("joi");
const { GENRES } = require("../models/book.model");

const currentYear = new Date().getFullYear();

// Used for POST. Everything required stays required.
const createBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  author: Joi.string().trim().required(),
  isbn: Joi.string().trim().required(),
  genre: Joi.string().valid(...GENRES),
  publishedYear: Joi.number().integer().min(1450).max(currentYear).required(),
  copiesTotal: Joi.number().integer().min(1),
});

// Used for PATCH. Everything optional, but copiesAvailable is left out on
// purpose — clients aren't allowed to set it directly (see README).
const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  author: Joi.string().trim(),
  isbn: Joi.string().trim(),
  genre: Joi.string().valid(...GENRES),
  publishedYear: Joi.number().integer().min(1450).max(currentYear),
  copiesTotal: Joi.number().integer().min(1),
}).min(1);

module.exports = { createBookSchema, updateBookSchema };
