const joi = require('joi');
const schema = joi.object({
  name: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'name field must be provided.',
      'string.empty': 'name field can\'t be empty',
    }),

  type: joi.string()
    .required()
    .custom((value, helpers) => {
      let validVallues = ['cinema', 'theater'];

      if (!validVallues.includes(value.trim())) {
        return helpers.error('any.only');
      }

      return value.trim();
    })
    .messages({
      'any.required': 'type field must be provided.',
      'any.only': 'type field not valid.',
    }),

  license_id: joi.string()
    .required()
    .trim()
    .length(10)
    .messages({
      'any.required': 'license_id field must be provided.',
      'string.length': 'license_id field must contain 10 characters.',
    }),

  address: joi.string()
    .required()
    .trim()
    .min(10)
    .messages({
      'any.required': 'address field must be provided.',
      'string.min': 'address field must contain at least 10 characters',
    }),

  city: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'city field must be provided.',
      'string.empty': 'city field can\'t be empty',
    }),
});

module.exports = schema;
