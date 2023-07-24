import Joi = require('joi');

const schema = Joi.object({
  content: Joi.string()
    .required()
    .min(100)
    .messages({
      'any.required': 'محتوای نقد نمایش باید وارد شود.',
      'string.min': 'محتوای نقد نمایش باید حداقل شامل ۱۰۰ کاراکتر باشد.',
    }),
});

export { schema as writeReviewInpValidator };
