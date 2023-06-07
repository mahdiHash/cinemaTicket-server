import Joi = require('joi');

const schema = Joi.object({
  access_level: Joi.string()
    .required()
    .trim()
    .custom((value: string, helpers) => {
      let validValues = ['play', 'comment'];

      if (!validValues.includes(value)) {
        return helpers.error('any.only');
      }
      else {
        return value;
      }
    })
    .messages({
      'any.required': 'سطح دسترسی ادمین باید وارد شود.',
      'any.only': 'سطح دسترسی ادمین معتبر نیست.'
    }),

  full_name: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
      'any.required': 'نام کامل باید وارد شود.',
      'string.empty': 'نام کامل باید حداقل 1 حرف داشته باشد.',
    }),

  tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'شمارۀ همراه باید وارد شود.',
      'string.length': 'شمارۀ همراه باید شامل 11 رقم باشد.',
    }),

  password: Joi.string()
    .required()
    .trim()
    .length(8)
    .messages({
      'any.required': 'رمز ورود باید وارد شود.',
      'string.length': 'رمز ورود باید حداقل 8 کاراکتر داشته باشد.',
    }),

  repeatPass: Joi.ref('password'),

  email: Joi.string()
    .required()
    .trim()
    .email()
    .messages({
      'any.required': 'ایمیل باید وارد شود.',
      'string.email': 'آدرس ایمیل معتبر نیست.',
    }),

  national_id: Joi.string()
    .required()
    .trim()
    .length(10)
    .messages({
      'any.required': 'کد ملی باید وارد شود.',
      'string.length': 'کد ملی باید 10 رقم داشته باشد.',
    }),

  home_tel: Joi.string()
    .required()
    .trim()
    .length(11)
    .messages({
      'any.required': 'تفلن ثابت باید وارد شود.',
      'string.length': 'تلفن ثابت باید شامل 11 رقم باشد.',
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
})
  .with('password', 'repeatPass');

export { schema as createAdminInpValidator };
