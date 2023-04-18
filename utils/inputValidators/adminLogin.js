const joi = require('joi');
const schema = joi.object({
  tel: joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'شمارۀ همراه باید وارد شود.',
      'string.length': 'شمارۀ همراه باید شامل 11 عدد باشد.',
    }),

  password: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'رمز ورود باید وارد شود.',
      'string.empty': 'رمز ورود نمی‌تواند خالی باشد.',
    }),
});

module.exports = schema;
