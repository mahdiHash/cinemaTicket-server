import Joi = require('joi');
const schema = Joi.object({
  tel: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      "any.required": "شمارۀ همراه باید وارد شود.",
      "string.empty": "شمارۀ همراه نمی‌تواند خالی باشد.",
    }),

  password: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      "any.required": "رمز ورود باید وارد شود.",
      "string.empty": "رمز ورود نمی‌تواند خالی باشد.",
    }),
});

export { schema as loginInpValidator };
