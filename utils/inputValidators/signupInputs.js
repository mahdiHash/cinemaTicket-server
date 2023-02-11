const Joi = require('joi');
const schema = Joi.object({
  tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      "any.required": "tel field must be provided.",
      "string.length": "tel filed must contain 11 characters."
    }),

  password: Joi.string()
    .required()
    .trim()
    .empty()
    .min(6)
    .messages({
      "any.required": "password must be provided.",
      "string.empty": "password can't be empty.",
      "string.min": "password should contain at least 6 characters.",
    }),

  repeatPass: Joi.ref('password'),
})
  .with('password', 'repeatPass');

module.exports = schema;
