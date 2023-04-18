const joi = require('joi');
const schema = joi.object({
  name: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'نام مکان باید وارد شود.',
      'string.empty': 'نام مکان نمی‌تواند خالی باشد.',
    }),

  type: joi.string()
    .required()
    .custom((value, helpers) => {
      let validVallues = ['cinema', 'theater'];

      if (!validVallues.includes(value.trim())) {
        return helpers.error('any.only');
      }

      return value.trim();
    })
    .messages({
      'any.required': 'نوع مکان باید وارد شود.',
      'any.only': 'نوع مکان معتبر نیست.',
    }),

  license_id: joi.string()
    .required()
    .trim()
    .length(10)
    .messages({
      'any.required': 'شمارۀ گواهینامه باید وارد شود.',
      'string.length': 'شمارۀ گواهینامه باید شامل 10 رقم باشد.',
    }),

  address: joi.string()
    .required()
    .trim()
    .min(10)
    .messages({
      'any.required': 'آدرس باید وارد شود.',
      'string.min': 'آدرس باید حداقل 10 کاراکتر داشته باشد.',
    }),

  city: joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'شهر باید وارد شود.',
      'string.empty': 'شهر نمی‌تواند خالی باشد.',
    }),
});

module.exports = schema;
