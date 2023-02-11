const Joi = require('joi');
const schema = Joi.object({
  oldPass: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'oldPass field must be provided.',
      'string.empty': 'oldPass field can\'t be empty.',
    }),

  newPass: Joi.string()
    .required()
    .trim()
    .empty()
    .min(6)
    .messages({
      'any.required': 'newPass field must be provided.',
      'string.empty': 'newPass field can\'t be empty.',
      'string.min': 'newPass field must contain at least 6 characters.'
    }),

  repeatNewPass: Joi.ref('newPass'),
})
  .with('newPass', 'repeatNewPass');

module.exports = schema;
