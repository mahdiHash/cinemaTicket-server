import Joi = require('joi');
import { playPicPosition } from '@prisma/client';

const schema = Joi.object({
  position: Joi.string()
    .required()
    .custom((value: playPicPosition, helpers: Joi.CustomHelpers) => {
      let validPositions = Object.keys(playPicPosition);

      // review pics are not allowed on this route
      if (value.trim() === 'review' || !validPositions.includes(value)) {
        return helpers.error('any.only');
      }

      return value;
    })
    .messages({
      'any.only': 'موقعیت تصویر معتبر نیست.',
    }),
});

export { schema as uploadPlayPicsInpValidator };
