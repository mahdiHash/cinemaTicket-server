import Joi = require('joi');

const schema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(3)
    .messages({
      'string.empty': 'full_name quey field can\'t be empty.',
      'string.min': 'full_name field must contain at least 3 characters.',
    }),

  cursor: Joi.number()
    .min(1)
    .messages({
      'number.min': 'cursor quey field must be a positive integer.'
    }),

  backward: Joi.boolean(),
});

export { schema as getAllCelebritiesQuValidator };
