import Joi = require('joi');

const schema = Joi.object({
  full_name: Joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'نام کامل نمی‌تواند خالی باشد.',
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

  credit_card_num: Joi.string()
    .trim()
    .length(16)
    .messages({
      'string.length': 'شمارۀ کارت باید شامل 16 رقم باشد.',
      'string.empty': 'شمارۀ کارت نمی‌تواند خالی باشد.',
    }),

  national_id: Joi.string()
    .trim()
    .length(10)
    .messages({
      'string.length': 'کد ملی باید شامل 10 رقم باشد.',
      'string.empty': 'کد ملی نمی‌تواند خالی باشد.',
    }),
});

export { schema as updateUserProfileInpValidator };
