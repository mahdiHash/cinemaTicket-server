import Joi = require('joi');

const schema = Joi.object({
  creditCard: Joi.string()
    .required()
    .trim()
    .empty()
    .length(16)
    .messages({
      'string.empty': 'شماره کارت باید وارد شود.',
      'string.length': 'شماره کارت باید دارای ۱۶ رقم باشد.',
  }),

  nationalId: Joi.string()
    .required()
    .trim()
    .empty()
    .length(10)
    .messages({
      'string.empty': 'کد ملی باید وارد شود.',
      'string.length': 'کد ملی باید شامل ۱۰ رقم باشد.',
  }),
});

export { schema as creditCardInpValidator };
