const Joi = require('joi');
const schema = Joi.object({
  oldPass: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'رمز ورود قدیمی باید وارد شود.',
      'string.empty': 'رمز ورود قدیمی نمی‌تواند خالی باشد.',
    }),

  newPass: Joi.string()
    .required()
    .trim()
    .empty()
    .min(6)
    .messages({
      'any.required': 'رمز ورود جدید باید وارد شود.',
      'string.empty': 'رمز ورود جدید نمی‌تواند خالی باشد.',
      'string.min': 'رمز ورود جدید باید حداقل 6 کاراکتر داشته باشد.'
    }),

  repeatNewPass: Joi.ref('newPass'),
})
  .with('newPass', 'repeatNewPass');

module.exports = schema;
