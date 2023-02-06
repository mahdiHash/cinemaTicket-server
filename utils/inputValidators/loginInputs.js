const Joi = require('joi');
const schema = Joi.object({
  tel: Joi.string()
    .trim()
    .empty()
    .length(11)
    .messages({
      "string.empty": "tel filed can't be empty.",
      "string.length": "tel field must contain 11 characters.",
    }),

  password: Joi.string()
    .trim()
    .empty()
    .messages({
      "string.empty": "password field can't be empty.",
    }),
});

module.exports = schema;
