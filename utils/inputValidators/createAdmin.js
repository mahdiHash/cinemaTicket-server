const joi = require('joi');
const schema = joi.object({
  access_level: joi.string()
    .required()
    .trim()
    .custom((value, helpers) => {
      let validValues = ['play', 'comment'];

      if (!validValues.includes(value)) {
        return helpers.error('any.invalid');
      }
      else {
        return value;
      }
    })
    .messages({
      'any.required': 'access_level field must be provided.',
      'any.invalid': 'access_level field not valid.'
    }),

  full_name: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'full_name field must be provided.',
      'string.empty': 'full_name field must contain at least 1 character.',
    }),

  tel: joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'tel field must be provided.',
      'string.length': 'tel field must contain 11 characters.',
    }),

  password: joi.string()
    .required()
    .trim()
    .length(8)
    .messages({
      'any.required': 'password field must be provided.',
      'string.length': 'password must contain at least 8 characters.',
    }),

  repeatPass: joi.ref('password'),

  email: joi.string()
    .required()
    .trim()
    .email()
    .messages({
      'any.required': 'email field must be provided.',
      'string.email': 'email address is not valid.',
    }),

  national_id: joi.string()
    .required()
    .trim()
    .length(10)
    .messages({
      'any.required': 'national_id must be provided.',
      'string.length': 'national_id must contain 10 characters.',
    }),

  home_tel: joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'home_tel field must be provided.',
      'string.length': 'home_tel field must contain 11 characters.',
    }),

  full_address: joi.string()
    .required()
    .trim()
    .min(10)
    .messages({
      'any.required': 'full_address field must be provided.',
      'string.min': 'full_address field must contain at least 11 characters.',
      'string.empty': 'full_address field can\'t be empty.',
    }),
})
  .with('password', 'repeatPass');

module.exports = schema;
