import Joi = require('joi');

const schema = Joi.object({
  status: Joi.string()
    .required()
    .trim()
    .custom((value: string, helpers) => {
      if (['waiting', 'approved', 'denied'].includes(value.trim())) {
        return value.trim();
      }
      else {
        return helpers.error('any.invalid');
      }
    })
    .messages({
      'any.required': 'the status field of query must be provided.',
      'any.invalid': 'the status field of query is not valid.',
    }),

  sort: Joi.string()
    .trim()
    .custom((value: string, helpers) => {
      if (['asc', 'desc'].includes(value.trim())) {
        return value.trim();
      }
      else {
        return helpers.error('any.invalid');
      }
    })
    .messages({
      'any.invalid': 'the sort field of query is not valid.',
    }),

  cursor: Joi.number()
    .min(1)
    .messages({
      'number.min': 'cursor field must be more than 1.',
      'number.base': 'cursor field must be a number.',
    }),

  backward: Joi.boolean(),

  license_id: Joi.string()
    .trim()
    .length(10)
    .messages({
      'string.length': 'the license_id field of query must contain 10 characters.',
    }),
});

export { schema as getAllPlacesRegistersQuValidator };
