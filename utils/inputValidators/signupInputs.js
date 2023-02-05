const Joi = require('joi');
const schema = Joi.object({
  tel: Joi.string()
    .trim()
    .length(11),

  password: Joi.string()
    .trim()
    .min(6),

  repeatPass: Joi.ref('password')
})
  .with('password', 'repeatPass');

module.exports = schema;
