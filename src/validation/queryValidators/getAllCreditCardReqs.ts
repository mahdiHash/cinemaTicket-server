import Joi = require('joi');

const schema = Joi.object({
  cursor: Joi.number()
    .min(1)
    .messages({
      'number.min': 'کوئری نامعتبر است.',
    }),
});

export { schema as getAllCreditCardReqsQuValidator };
