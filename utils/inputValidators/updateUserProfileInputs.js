const Joi = require('joi');
const schema = Joi.object({
  full_name: Joi.string()
    .trim()
    .empty()
    .messages({
      'string.base': 'full_name filed must be a string.',
      'string.empty': 'full_name field can\'t be empty, if provided.',
    }),

  tel: Joi.string()
    .trim()
    .length(11)
    .messages({
      'string.base': 'tel field must be a string.',
      'string.length': 'tel field must contain 11 characters.',
      'string.empty': 'tel field can\'t be empty, if provided.',
    }),

  email: Joi.string()
    .trim()
    .email()
    .messages({
      'string.base': 'email field must be a string.',
      'string.email': 'Provided value for email field is not valid.',
      'string.empty': 'email field can\'t be empty, if provided.',
    }),

  birthday: Joi.string()
    .trim()
    .isoDate()
    .messages({
      'string.base': 'birthday field must be a string.',
      'string.isoDate': 'birthday field is not valid.',
      'string.empty': 'birthday field can\'t be empty, if provided.',
    }),

  credit_card_num: Joi.string()
    .trim()
    .length(16)
    .messages({
      'string.base': 'credit_card_num field must be a string.',
      'string.length': 'credit_card_num field must contain 16 characters.',
      'string.empty': 'credit_card_num field can\'t be empty, if provided.',
    }),

  national_id: Joi.string()
    .trim()
    .length(10)
    .messages({
      'string.base': 'national_id field must be a string',
      'string.length': 'national_id field must contain 10 characters.',
      'string.empty': 'national_id field can\'t be empty, if provided.',
    }),
});

module.exports = schema;
