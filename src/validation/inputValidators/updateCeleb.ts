import Joi = require('joi');
import { celebRole } from '@prisma/client';

const schema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(3)
    .messages({
      'string.empty': 'نام کامل نمی‌تواند خالی باشد.',
      'string.min': 'نام کامل باید حداقل 3 حرف داشته باشد.',
    }),

  role: Joi.string()
    .custom((roles: string | celebRole[], helpers) => {
      let validValues = ['actor', 'actress', 'writer', 'presenter', 'director'];
      roles = typeof roles === 'string' ? JSON.parse(roles) : roles;

      for (let role of roles) {
        if (!validValues.includes(role)) {
          return helpers.error('any.invalid');
        }
      }

      return roles;
    })
    .messages({
      'array.max': 'نقش فرد باید حداکثر شامل 5 مورد باشد.',
      'array.min': 'نقش فرد باید حداقل شامل 1 مورد شود.',
      'any.invalid': 'نقش فرد شامل موارد نامعتبر است.',
    }),

  birthday: Joi.date()
    .iso()
    .messages({
      'date.format': 'تاریخ تولد معتبر نیست.',
    }),

  birth_city: Joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'شهر محل تولد نمی‌تواند خالی باشد.',
    }),

  bio: Joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'بیوی فرد نمی‌تواند خالی باشد.',
    }),
});

export { schema as updateCelebInpValidator };
