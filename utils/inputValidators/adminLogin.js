const joi = require('joi');
const schema = joi.object({
  tel: joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'tel field must be provided.',
      'string.length': 'tel field must contain 11 characters',
    }),

  password: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'password field must be provided.',
      'string.empty': 'password field can\'t be empty',
    }),
});

module.exports = schema;
