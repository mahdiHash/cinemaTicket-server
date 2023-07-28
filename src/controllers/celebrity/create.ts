import { Request, Response } from 'express';
import { prisma, passport, imageKit, storeImgLocally } from '../../config';
import {
  storeValidatedInputs,
  middlewareWrapper,
  playAdminAuth,
} from '../../middlewares';
import { createCelebInpValidator } from '../../validation/inputValidators';
import { createReadStream } from 'fs';
import { rm } from 'fs/promises';
import { errorLogger } from '../../helpers/errors';
import { celebrities } from '@prisma/client';
import { CelebrityService } from '../../services/celebrity/celebrity.service';

const Celebrity = new CelebrityService();
const controller = [
  // authorization
  passport.authenticate('adminJwt', { session: false }),

  middlewareWrapper(playAdminAuth),

  // parse and locally store the uploaded image
  storeImgLocally.single('img'),

  middlewareWrapper(storeValidatedInputs(createCelebInpValidator)),

  middlewareWrapper(async (req: Request, res: Response) => {
    const celeb = await Celebrity.createCeleb(res.locals.validBody, req.file);
    
    res.json({
      celeb,
      message: 'پروفایل هنرمند با موفقیت ایجاد شد.',
    });
  }
  ),
];

export { controller as create };
