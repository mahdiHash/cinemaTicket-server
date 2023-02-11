const Joi = require('joi');
const schema = Joi.object({
  tel: Joi.string()
    .required()
    .trim()
    .empty()
    .length(11)
    .messages({
      "any.required": "tel field must be provided.",
      "string.empty": "tel filed can't be empty.",
      "string.length": "tel field must contain 11 characters.",
    }),

  password: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      "any.required": "password field must be provided.",
      "string.empty": "password field can't be empty.",
    }),
});

module.exports = schema;
