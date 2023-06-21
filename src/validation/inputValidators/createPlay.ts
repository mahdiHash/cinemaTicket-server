import Joi = require('joi');
import { genresType, playType } from '../../types/types';

const schema = Joi.object({
  title: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
    'any.required': 'نام نمایش باید وارد شود.',
    'string.empty': 'نام نمایش نباید خالی باشد.',
  }),

  director: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
    'any.required': 'نام کارگردان باید وارد شود.',
    'string.empty': 'نام کارگردان نمی‌تواند خالی باشد.',
  }),

  producer: Joi.string()
    .required()
    .trim()
    .empty()
    .messages({
    'any.required': 'نام تهیه‌کننده باید وارد شود.',
    'string.empty': 'نام تهیه‌کننده نمی‌تواند خالی باشد.',
  }),

  duration: Joi.number()
    .required()
    .min(1)
    .messages({
    'number.min': 'مدت زمان فیلم نمی‌تواند کمتر از ۱ باشد.',
  }),

  genre: Joi.array()
    .required()
    .custom((value: genresType[], helpers: Joi.CustomHelpers) => {
      const validGenres = [
        'drama',
        'romantic',
        'action',
        'horror',
        'scifi',
        'adventure',
        'mystery',
        'comedy',
        'historical',
        'biography',
        'social',
        'animation',
        'kids',
        'documentery',
      ];

      for (let genre of value) {
        if (!validGenres.includes(genre)) {
          return helpers.error('any.only');
        }
      }

      return value;
    })
    .messages({
      'any.only': 'ژانر انتخابی معتبر نیست.',
      'any.required': 'ژانر فیلم باید تعیین شود.',
    }),

  type: Joi.string()
    .required()
    .trim()
    .custom((value: playType, helpers: Joi.CustomHelpers) => {
      const validPlayTypes = ['movie', 'show'];

      if (!validPlayTypes.includes(value)) {
        return helpers.error('any.only');
      } else {
        return value;
      }
    })
    .messages({
      'any.only': 'نوع فیلم معتبر نیست.',
      'any.required': 'نوع فیلم باید تعیین شود.',
    }),

  intro: Joi.string()
    .required()
    .trim()
    .min(30)
    .messages({
    'any.required': 'خلاصه فیلم باید وارد شود.',
    'string.min': 'خلاصه فیلم باید حداقل دارای ۳۰ کاراکتر باشد.',
  }),

  publish_date: Joi.string().isoDate().messages({
    'string.isoDate': 'تاریخ انتشار معتبر نیست.',
  }),

  celebrities: Joi.array()
    .items(Joi.number().required())
    .min(1)
    .messages({
      'array.includes': 'محتوای بازیگران معتبر نیست.',
      'array.min': 'حداقل یک بازیگر باید وارد شود.',
    }),
});

export { schema as createPlayInpValidator };
