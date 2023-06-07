import Joi = require('joi');

const schema = Joi.object({
  tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      "any.required": "شمارۀ همراه باید وارد شود.",
      "string.length": "شمارۀ همراه باید شامل 11 رقم باشد."
    }),

  password: Joi.string()
    .required()
    .trim()
    .empty()
    .min(6)
    .messages({
      "any.required": "رمز ورود باید وارد شود.",
      "string.empty": "رمز ورود نمی‌تواند خالی باشد.",
      "string.min": "رمز ورود باید حداقل شامل 6 کاراکتر باشد.",
    }),

  repeatPass: Joi.ref('password'),
})
  .with('password', 'repeatPass');

export { schema as signupInpValidator };
