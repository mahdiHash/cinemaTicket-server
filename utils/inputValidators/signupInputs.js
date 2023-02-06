const Joi = require('joi');
const schema = Joi.object({
  tel: Joi.string()
    .trim()
    .length(11)
    .messages({
      "string.length": "tel filed must contain 11 characters."
    }),

  password: Joi.string()
    .trim()
    .empty()
    .min(6)
    .messages({
      "string.empty": "password can't be empty.",
      "string.min": "password should contain at least 6 characters.",
    }),

  repeatPass: Joi.ref('password'),
})
  .with('password', 'repeatPass');

module.exports = schema;
