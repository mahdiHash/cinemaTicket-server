const joi = require('joi');
const schema = joi.object({
  full_name: joi.string()
    .trim()
    .min(3)
    .messages({
      'string.empty': 'full_name field can\'t be empty.',
      'string.min': 'full_name field must contain at least 3 characters.',
    }),

  cursor: joi.number()
    .min(1)
    .messages({
      'number.min': 'cursor field must be a positive integer.'
    }),

  backward: joi.boolean(),
});

module.exports = schema;
