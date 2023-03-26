const joi = require('joi');
const schema = joi.object({
  full_name: joi.string()
    .trim()
    .min(3)
    .messages({
      'string.empty': 'full_name field can\'t be empty',
      'string.min': 'full_name field must contain at least 3 characters.',
      'any.required': 'full_name field must be provided.',
    }),

  role: joi.string()
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
      'array.max': 'role array field must contain at most 5 items.',
      'array.min': 'role array field must contain at least 1 item.',
      'any.invalid': 'role array field contain invalid values.',
      'any.required': 'role array field must be provided.',
    }),

  birthday: joi.date()
    .iso()
    .messages({
      'date.format': 'birthday field is not a valid date.',
    }),

  birth_city: joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'birth_city can\'t be empty.',
    }),

  bio: joi.string()
    .trim()
    .empty()
    .messages({
      'string.empty': 'bio field can\'t be empty.',
    }),
});

module.exports = schema;
