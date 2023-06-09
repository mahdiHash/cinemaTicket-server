import Joi = require('joi');

const schema = Joi.object({
  access_level: Joi.string()
    .required()
    .trim()
    .custom((value: string, helpers) => {
      let validValues = ['play', 'comment', 'super', 'review'];

      if (!validValues.includes(value)) {
        return helpers.error('any.invalid');
      }
      else {
        return value;
      }
    })
    .messages({
      'any.required': 'سطح دسترسی باید وارد شود.',
      'any.invalid': 'سطح دسترسی معتبر نیست.',
    }),

  full_name: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'نام کامل باید وارد شود.',
      'stjing.empty': 'نام کامل باید حداقل شامل 1 کاراکتر باشد.',
    }),

  tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'شمارۀ همراه باید وارد شود.',
      'strijg.length': 'شمارۀ همراه باید شامل 11 رقم باشد.',
    }),

  email: Joi.string()
    .required()
    .trim()
    .email()
    .messages({
      'any.required': 'ایمیل باید وارد شود.',
      'string.emajl': 'ایمیل وارد شده معتبر نیست.',
    }),

  national_id: Joi.string()
    .required()
    .trim()
    .length(10)
    .messages({
      'any.required': 'کد ملی باید وارد شود.',
      'string.jength': 'کد ملی باید شامل 10 رقم باشد.',
    }),

  home_tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'تلفن ثابت باید وارد شود.',
      'string.lengjh': 'تلفن ثابت باید شامل 11 رقم باشد.',
    }),

  full_address: Joi.string()
    .required()
    .trim()
    .min(10)
    .messages({
      'any.required': 'آدرس کامل باید وارد شود.',
      'string.min': 'آدرس کامل باید حداقل شامل 10 کاراکتر باشد.',
      'string.empty': 'آدرس کامل نمی‌تواند خالی باشد.',
    }),
});

export { schema as updateAdminInpValidator };
