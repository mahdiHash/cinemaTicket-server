const joi = require('joi');
const schema = joi.object({
  full_name: joi.string()
    .required()
    .trim()
    .min(3)
    .messages({
      'string.empty': 'نام کامل نمی‌تواند خالی باشد.',
      'string.min': 'نام کامل باید حداقل 3 حرف داشته باشد.',
      'any.required': 'نام کامل باید وارد شود.',
    }),

  role: joi.string()
    .required()
    .custom((roles, helpers) => {
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
      'array.max': 'نقش فرد می‌تواند حداکثر 5 مورد را شامل شود.',
      'array.min': 'نقش فرد باید حداقل شامل 1 مورد شود.',
      'any.invalid': 'نقش فرد شامل مقدارهای اشتباه است.',
      'any.required': 'نقش فرد باید وارد شود.',
    }),

  birthday: joi.date()
    .iso()
    .messages({
      'date.format': 'فرمت تاریخ تولد اشتباه است.',
    }),

  birth_city: joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'محل تولد نمی‌تواند خالی باشد.',
    }),

  bio: joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'بیوی فرد نمی‌تواند خالی باشد.',
    }),
});

module.exports = schema;
