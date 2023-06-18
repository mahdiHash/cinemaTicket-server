import Joi = require('joi');

const schema = Joi.object({
  first_name: Joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'نام نمی‌تواند خالی باشد.',
    }),
  
  last_name: Joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'نام خانوادگی نمی‌تواند خالی باشد.',
    }),

  tel: Joi.string()
    .trim()
    .length(11)
    .messages({
      'string.length': 'شمارۀ همراه باید شامل 11 رقم باشد.',
      'string.empty': 'شمارۀ همراه نمی‌تواند خالی باشد.',
    }),

  email: Joi.string()
    .trim()
    .email()
    .messages({
      'string.email': 'ایمیل وارد شده معتبر نیست.',
      'string.empty': 'ایمیل نباید خالی باشد.',
    }),

  birthday: Joi.string()
    .trim()
    .isoDate()
    .messages({
      'string.isoDate': 'تاریخ تولد معتبر نیست.',
    }),
});

export { schema as updateUserProfileInpValidator };
