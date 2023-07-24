import Joi = require('joi');

const schema = Joi.object({
  tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'شمارۀ همراه باید وارد شود.',
      'string.length': 'شمارۀ همراه باید شامل 11 عدد باشد.',
    }),

  password: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'رمز ورود باید وارد شود.',
      'string.empty': 'رمز ورود نمی‌تواند خالی باشد.',
    }),
});

export { schema as adminLoginInpValidator };
